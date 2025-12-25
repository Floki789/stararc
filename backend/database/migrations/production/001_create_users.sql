-- ================================================
-- StarArc Production Migration 001: Create users table
-- ================================================

SET search_path TO public;

-- Create sequence
CREATE SEQUENCE IF NOT EXISTS users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    password_hash character varying(255) NOT NULL,
    email_verified boolean DEFAULT false,
    verification_token character varying(255),
    verification_token_expires timestamp without time zone,
    reset_token character varying(255),
    reset_token_expires timestamp without time zone,
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    email_verification_token character varying(255),
    email_verification_expires timestamp without time zone,
    password_reset_token character varying(255),
    password_reset_expires timestamp without time zone,
    role character varying(20) DEFAULT 'user'::character varying,
    stripe_customer_id character varying(255),
    subscription_plan character varying(50),
    subscription_status character varying(50),
    stripe_subscription_id character varying(255),
    subscription_expires_at timestamp without time zone,
    spaceship_auth_key text,
    onboarding_step character varying(50) DEFAULT 'registration'::character varying,
    login_method_selected character varying(20) DEFAULT NULL::character varying,
    spaceship_integration_completed boolean DEFAULT false,
    parent_user_id integer,
    is_apex_manager boolean DEFAULT false,
    max_managed_accounts integer DEFAULT 30,
    two_factor_enabled boolean DEFAULT false,
    two_factor_enabled_at timestamp without time zone,
    email_hash character varying(64),
    encrypted_email text,
    encrypted_alias text,
    encrypted_client_name text,
    encrypted_two_factor_secret text,
    encrypted_backup_codes text,
    admin_encrypted_email text,
    admin_encrypted_alias text,
    admin_encrypted_client_name text,
    admin_encrypted_two_factor_secret text
);

-- Set sequence ownership
ALTER SEQUENCE users_id_seq OWNED BY users.id;

-- Create primary key
ALTER TABLE ONLY users ADD CONSTRAINT users_pkey PRIMARY KEY (id);

-- Create unique constraints
ALTER TABLE ONLY users ADD CONSTRAINT users_email_hash_key UNIQUE (email_hash);

-- Create check constraints
ALTER TABLE ONLY users ADD CONSTRAINT check_apex_hierarchy CHECK (((parent_user_id IS NULL) OR ((parent_user_id IS NOT NULL) AND ((subscription_plan)::text = 'Core'::text))));
ALTER TABLE ONLY users ADD CONSTRAINT check_apex_manager_subscription CHECK (((is_apex_manager = false) OR ((is_apex_manager = true) AND ((subscription_plan)::text = 'Apex'::text))));
ALTER TABLE ONLY users ADD CONSTRAINT check_login_method CHECK (((login_method_selected IS NULL) OR ((login_method_selected)::text = ANY ((ARRAY['standard'::character varying, 'privacy'::character varying])::text[]))));
ALTER TABLE ONLY users ADD CONSTRAINT check_onboarding_step CHECK (((onboarding_step)::text = ANY ((ARRAY['registration'::character varying, 'subscription_selection'::character varying, 'auth_method_selection'::character varying, 'completed'::character varying])::text[])));
ALTER TABLE ONLY users ADD CONSTRAINT check_subscription_plan CHECK (((subscription_plan)::text = ANY ((ARRAY['Free'::character varying, 'Spark'::character varying, 'Core'::character varying, 'Apex'::character varying, 'ApexChild'::character varying])::text[])));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_apex_hierarchy ON users USING btree (parent_user_id, subscription_plan) WHERE (parent_user_id IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_users_email_hash ON users USING btree (email_hash);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users USING btree (email_verified);
CREATE INDEX IF NOT EXISTS idx_users_is_apex_manager ON users USING btree (is_apex_manager);
CREATE INDEX IF NOT EXISTS idx_users_login_method ON users USING btree (login_method_selected);
CREATE INDEX IF NOT EXISTS idx_users_onboarding_step ON users USING btree (onboarding_step);
CREATE INDEX IF NOT EXISTS idx_users_parent_user_id ON users USING btree (parent_user_id);
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users USING btree (reset_token);
CREATE INDEX IF NOT EXISTS idx_users_spaceship_auth_key ON users USING btree (spaceship_auth_key);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users USING btree (stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_plan ON users USING btree (subscription_plan);
CREATE INDEX IF NOT EXISTS idx_users_two_factor_enabled ON users USING btree (two_factor_enabled) WHERE (two_factor_enabled = true);
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users USING btree (verification_token);

-- Create foreign key constraint (self-reference)
ALTER TABLE ONLY users ADD CONSTRAINT users_parent_user_id_fkey FOREIGN KEY (parent_user_id) REFERENCES users(id);

-- Create trigger for updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();