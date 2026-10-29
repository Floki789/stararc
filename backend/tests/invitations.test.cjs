const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { randomBytes } = require('node:crypto');

// Refuse to use application databases: this suite creates and drops only its own schema.
const databaseUrl = process.env.INVITATION_TEST_DATABASE_URL;
if (!databaseUrl || !['localhost', '127.0.0.1'].includes(new URL(databaseUrl).hostname)
    || new URL(databaseUrl).pathname !== '/stararc_invitation_test') {
  throw new Error('Set INVITATION_TEST_DATABASE_URL to a local database named stararc_invitation_test.');
}
const schema = `invitation_test_${randomBytes(6).toString('hex')}`;
Object.assign(process.env, {
  NODE_ENV: 'test', DATABASE_URL: databaseUrl, PGOPTIONS: `-c search_path=${schema}`,
  JWT_SECRET: 'invitation-tests-only', EMAIL_HASH_SALT: 'invitation-tests-only',
  ADMIN_USER_DATA_ENCRYPTION_KEY: '11'.repeat(32), DEK_SERVER_SECRET: 'invitation-tests-only',
  INVITATION_ADMIN_EMAIL: 'owner@example.com', FRONTEND_URL: 'http://localhost:3003',
  TURNSTILE_SECRET_KEY: ''
});
const { Pool } = require('pg');
const setupPool = new Pool({ connectionString: databaseUrl, options: '-c search_path=public' });
const { pool } = require('../dist/database/connection');
const { AuthService } = require('../dist/services/authService');
const { InvitationService, InvitationError } = require('../dist/services/invitationService');
const { UserEncryptionService } = require('../dist/services/userEncryptionService');
const { EmailService } = require('../dist/services/emailService');
const mails = [];
let failMail = false;
EmailService.prototype.initEthereal = async function () {
  this.transporter = { sendMail: async mail => {
    if (failMail) throw new Error('Simulated SMTP failure');
    mails.push(mail); return {};
  } };
};
const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/invitations', require('../dist/routes/invitations').default);
app.use('/api/auth', require('../dist/routes/auth').default);
const service = new InvitationService(pool);
const auth = new AuthService(pool);
let server, base, adminId, adminToken, userToken;

async function api(url, body, token) {
  const response = await fetch(base + url, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  });
  return { status: response.status, body: await response.json() };
}
async function invite(email) {
  const id = await service.request(email, 'Test User', '', 'de');
  return { id, ...await service.issue(id, adminId) };
}
function register(email, code, dek) {
  return auth.registerUser(email, 'StrongPass1', 'Test', true, '127.0.0.1', 'de', dek, code);
}
async function row(id) { return (await pool.query('SELECT * FROM access_requests WHERE id = $1', [id])).rows[0]; }

before(async () => {
  await setupPool.query(`CREATE SCHEMA ${schema}`);
  await pool.query(`CREATE TABLE users (
    id SERIAL PRIMARY KEY, password_hash TEXT NOT NULL, email_hash VARCHAR(64) UNIQUE,
    encrypted_email TEXT, encrypted_alias TEXT, admin_encrypted_email TEXT, admin_encrypted_alias TEXT,
    email_verified BOOLEAN DEFAULT false, email_verification_token TEXT, email_verification_expires TIMESTAMPTZ,
    role TEXT DEFAULT 'user', subscription_plan TEXT, last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW(),
    admin_encrypted_terms_accepted_at TEXT, admin_encrypted_terms_version TEXT, admin_encrypted_terms_ip_address TEXT,
    admin_encrypted_privacy_accepted_at TEXT, admin_encrypted_privacy_version TEXT, admin_encrypted_privacy_ip_address TEXT,
    language_code TEXT, wrapped_dek TEXT, wrapped_dek_server TEXT, dek_salt TEXT, login_method_selected TEXT,
    onboarding_step TEXT DEFAULT 'registration', spaceship_integration_completed BOOLEAN DEFAULT false
  )`);
  const migration = fs.readFileSync(path.join(__dirname, '../database/migrations/022_invitation_access.sql'), 'utf8');
  await pool.query(migration);
  await pool.query(migration); // Re-running the deployment migration is safe.
  const result = await pool.query(
    `INSERT INTO users (email_hash, password_hash, admin_encrypted_email, admin_encrypted_alias, email_verified)
     VALUES ($1, 'test', $2, $3, true) RETURNING id`,
    [UserEncryptionService.generateEmailHash('owner@example.com'),
      UserEncryptionService.encryptWithMasterKey('owner@example.com'), UserEncryptionService.encryptWithMasterKey('Owner')]
  );
  adminId = result.rows[0].id;
  adminToken = auth.generateToken({ id: adminId, email: 'owner@example.com' });
  const ordinary = await pool.query(
    `INSERT INTO users (password_hash, admin_encrypted_email, email_verified, subscription_plan)
     VALUES ('test', $1, true, 'Apex') RETURNING id`, [UserEncryptionService.encryptWithMasterKey('ordinary@example.com')]
  );
  userToken = auth.generateToken({ id: ordinary.rows[0].id, email: 'ordinary@example.com', role: 'admin' });
  // JWT role claims do not grant access; authorization checks the database user.
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
  await pool.end();
  await setupPool.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`);
  await setupPool.end();
});

test('access requests are encrypted, deduplicated, notify the owner and reveal no existing accounts', async () => {
  const body = { email: 'request@example.com', name: 'Person', message: '<img src=x>', languageCode: 'en' };
  const first = await api('/api/invitations/request', body);
  assert.equal(first.status, 202);
  assert.equal(mails.length, 1);
  assert.equal(mails[0].to, 'owner@example.com');
  assert.match(mails[0].text, /\/admin\/invitations/);
  assert.equal(mails[0].html, undefined);
  assert.deepEqual(await api('/api/invitations/request', body), first);
  assert.equal(mails.length, 1);
  assert.deepEqual(await api('/api/invitations/request', { ...body, email: 'owner@example.com' }), first);
  const saved = (await pool.query('SELECT * FROM access_requests WHERE email_hash=$1',
    [UserEncryptionService.generateEmailHash(body.email)])).rows[0];
  assert.notEqual(saved.encrypted_email, body.email);
  assert.equal(UserEncryptionService.decryptWithMasterKey(saved.encrypted_message), body.message);
  assert.equal(saved.status, 'pending');
});

test('admin endpoints reject unauthenticated, ordinary and unverified users; managed accounts cannot bypass approval', async () => {
  assert.equal((await api('/api/invitations/admin')).status, 401);
  assert.equal((await api('/api/invitations/admin', undefined, userToken)).status, 403);
  assert.equal((await api('/api/auth/create-apex-client', { clientName: 'Client', clientEmail: 'client@example.com' }, userToken)).status, 403);
  assert.equal((await api('/api/invitations/admin', undefined, adminToken)).status, 200);
  await pool.query('UPDATE users SET email_verified=false WHERE id=$1', [adminId]);
  assert.equal((await api('/api/invitations/admin/me', undefined, adminToken)).status, 403);
  await pool.query('UPDATE users SET email_verified=true WHERE id=$1', [adminId]);
});

test('registration without approval or with another email is blocked', async () => {
  assert.equal((await api('/api/auth/register', { email: 'missing@example.com', password: 'StrongPass1', termsAccepted: true })).status, 400);
  await assert.rejects(register('missing@example.com'), InvitationError);
  const pending = await service.request('pending@example.com', 'Pending', '', 'de');
  await assert.rejects(register('pending@example.com', 'NOVA-4827'), InvitationError);
  assert.equal((await row(pending)).status, 'pending');
  const issued = await invite('bound@example.com');
  await assert.rejects(register('wrong@example.com', issued.code), InvitationError);
  assert.equal((await row(issued.id)).failed_attempts, 0);
});

test('approval sends a simple code and link, code registers once and retains email verification', async () => {
  const id = await service.request('approve@example.com', 'Approve', '', 'de');
  const approved = await api(`/api/invitations/admin/${id}/approve`, {}, adminToken);
  assert.equal(approved.status, 200);
  assert.match(approved.body.code, /^[A-Z]+-\d{4}$/);
  assert.equal(approved.body.emailSent, true);
  assert.match(mails.at(-1).text, /Dein Zugang wurde freigegeben/);
  const before = await row(id);
  assert.notEqual(before.code_hash, approved.body.code);
  assert.ok(new Date(before.expires_at) > new Date(Date.now() + 13 * 86400000));
  const registered = await api('/api/auth/register', { email: 'approve@example.com', password: 'StrongPass1',
    termsAccepted: true, invitationCode: approved.body.code.toLowerCase() });
  assert.equal(registered.status, 201);
  assert.equal(registered.body.requiresVerification, true);
  assert.equal((await row(id)).status, 'used');
  await assert.rejects(register('approve@example.com', approved.body.code), InvitationError);
  assert.equal((await row(id)).code_hash, null);
});

test('link token works; concurrent registrations create exactly one account', async () => {
  const issued = await invite('concurrent@example.com');
  const token = new URLSearchParams(new URL(issued.link).hash.slice(1)).get('invite');
  const results = await Promise.allSettled([register('concurrent@example.com', token), register('concurrent@example.com', token)]);
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
  assert.equal(results.filter(result => result.status === 'rejected').length, 1);
  assert.equal((await row(issued.id)).status, 'used');
});

test('expiry, rejection and revocation block access; reissuing invalidates the old link', async () => {
  const issued = await invite('expiry@example.com');
  await pool.query("UPDATE access_requests SET expires_at=NOW()-INTERVAL '1 second' WHERE id=$1", [issued.id]);
  await assert.rejects(register(issued.email, issued.code), InvitationError);
  const fresh = await service.issue(issued.id, adminId);
  const oldToken = new URLSearchParams(new URL(issued.link).hash.slice(1)).get('invite');
  await assert.rejects(register(issued.email, oldToken), InvitationError);
  await service.changeStatus(issued.id, 'revoked', adminId);
  await assert.rejects(register(issued.email, fresh.code), InvitationError);
  await service.changeStatus(issued.id, 'rejected', adminId);
  await assert.rejects(register(issued.email, fresh.code), InvitationError);
});

test('ten incorrect codes persistently lock the invitation until the admin reissues it', async () => {
  const issued = await invite('locked@example.com');
  for (let i = 0; i < 10; i++) await assert.rejects(register(issued.email, 'WRONG-0000'), InvitationError);
  assert.equal((await row(issued.id)).failed_attempts, 10);
  await assert.rejects(register(issued.email, issued.code), InvitationError);
  const fresh = await service.issue(issued.id, adminId);
  assert.equal((await row(issued.id)).failed_attempts, 0);
  await register(issued.email, fresh.code);
});

test('a failure after inserting the user rolls back both the account and invitation use', async () => {
  const issued = await invite('rollback@example.com');
  const secret = process.env.DEK_SERVER_SECRET;
  const fallback = process.env.SPACESHIP_AUTH_ENCRYPTION_KEY;
  process.env.DEK_SERVER_SECRET = '';
  process.env.SPACESHIP_AUTH_ENCRYPTION_KEY = '';
  try {
    await assert.rejects(register(issued.email, issued.code, { dek: 'AA==', wrapped_dek: 'test', dek_salt: 'test' }), /DEK_SERVER_SECRET/);
  } finally {
    process.env.DEK_SERVER_SECRET = secret;
    if (fallback === undefined) delete process.env.SPACESHIP_AUTH_ENCRYPTION_KEY;
    else process.env.SPACESHIP_AUTH_ENCRYPTION_KEY = fallback;
  }
  assert.equal((await row(issued.id)).status, 'approved');
  const result = await pool.query('SELECT id FROM users WHERE email_hash=$1', [UserEncryptionService.generateEmailHash(issued.email)]);
  assert.equal(result.rows.length, 0);
  await register(issued.email, issued.code);
});

test('direct invitations report mail failures and remain copyable; request rate limit is enforced', async () => {
  failMail = true;
  const issued = await api('/api/invitations/admin', { email: 'direct@example.com', name: 'Direct' }, adminToken);
  failMail = false;
  assert.equal(issued.status, 201);
  assert.equal(issued.body.emailSent, false);
  assert.ok(issued.body.link);
  assert.equal((await api('/api/invitations/request', { email: 'fifth@example.com', name: 'Fifth' })).status, 202);
  assert.equal((await api('/api/invitations/request', { email: 'sixth@example.com', name: 'Sixth' })).status, 202);
  assert.equal((await api('/api/invitations/request', { email: 'limited@example.com', name: 'Limited' })).status, 429);
});
