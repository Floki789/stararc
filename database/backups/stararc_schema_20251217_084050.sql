--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13 (Homebrew)
-- Dumped by pg_dump version 15.13 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: sam
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO sam;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: sam
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO sam;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: sam
--

CREATE TABLE public.users (
    id integer NOT NULL,
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
    admin_encrypted_two_factor_secret text,
    CONSTRAINT check_apex_hierarchy CHECK (((parent_user_id IS NULL) OR ((parent_user_id IS NOT NULL) AND ((subscription_plan)::text = 'Core'::text)))),
    CONSTRAINT check_apex_manager_subscription CHECK (((is_apex_manager = false) OR ((is_apex_manager = true) AND ((subscription_plan)::text = 'Apex'::text)))),
    CONSTRAINT check_login_method CHECK (((login_method_selected IS NULL) OR ((login_method_selected)::text = ANY ((ARRAY['standard'::character varying, 'privacy'::character varying])::text[])))),
    CONSTRAINT check_onboarding_step CHECK (((onboarding_step)::text = ANY ((ARRAY['registration'::character varying, 'subscription_selection'::character varying, 'auth_method_selection'::character varying, 'completed'::character varying])::text[]))),
    CONSTRAINT check_subscription_plan CHECK (((subscription_plan)::text = ANY ((ARRAY['Free'::character varying, 'Spark'::character varying, 'Core'::character varying, 'Apex'::character varying, 'ApexChild'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO sam;

--
-- Name: TABLE users; Type: COMMENT; Schema: public; Owner: sam
--

COMMENT ON TABLE public.users IS 'User accounts with privacy-by-design approach';


--
-- Name: COLUMN users.stripe_customer_id; Type: COMMENT; Schema: public; Owner: sam
--

COMMENT ON COLUMN public.users.stripe_customer_id IS 'Stripe customer ID for payment management - replaces complex billing tables';


--
-- Name: COLUMN users.spaceship_auth_key; Type: COMMENT; Schema: public; Owner: sam
--

COMMENT ON COLUMN public.users.spaceship_auth_key IS 'AES-GCM encrypted auth key for Spaceship access (JSON: {iv, tag, data})';


--
-- Name: COLUMN users.onboarding_step; Type: COMMENT; Schema: public; Owner: sam
--

COMMENT ON COLUMN public.users.onboarding_step IS 'Current step in user onboarding process';


--
-- Name: COLUMN users.login_method_selected; Type: COMMENT; Schema: public; Owner: sam
--

COMMENT ON COLUMN public.users.login_method_selected IS 'Selected authentication method: standard or privacy';


--
-- Name: COLUMN users.spaceship_integration_completed; Type: COMMENT; Schema: public; Owner: sam
--

COMMENT ON COLUMN public.users.spaceship_integration_completed IS 'Whether Spaceship app integration is completed';


--
-- Name: COLUMN users.parent_user_id; Type: COMMENT; Schema: public; Owner: sam
--

COMMENT ON COLUMN public.users.parent_user_id IS 'Reference to parent Apex manager for ApexChild accounts';


--
-- Name: COLUMN users.is_apex_manager; Type: COMMENT; Schema: public; Owner: sam
--

COMMENT ON COLUMN public.users.is_apex_manager IS 'Indicates if user is an Apex subscription manager';


--
-- Name: COLUMN users.max_managed_accounts; Type: COMMENT; Schema: public; Owner: sam
--

COMMENT ON COLUMN public.users.max_managed_accounts IS 'Maximum number of ApexChild accounts this Apex user can manage';


--
-- Name: COLUMN users.two_factor_enabled; Type: COMMENT; Schema: public; Owner: sam
--

COMMENT ON COLUMN public.users.two_factor_enabled IS 'Whether 2FA is enabled for this user';


--
-- Name: COLUMN users.two_factor_enabled_at; Type: COMMENT; Schema: public; Owner: sam
--

COMMENT ON COLUMN public.users.two_factor_enabled_at IS 'Timestamp when 2FA was first enabled';


--
-- Name: COLUMN users.email_hash; Type: COMMENT; Schema: public; Owner: sam
--

COMMENT ON COLUMN public.users.email_hash IS 'SHA-256 hash of email for login lookup (deterministic)';


--
-- Name: COLUMN users.encrypted_email; Type: COMMENT; Schema: public; Owner: sam
--

COMMENT ON COLUMN public.users.encrypted_email IS 'Email encrypted with user password (user-only access)';


--
-- Name: COLUMN users.encrypted_alias; Type: COMMENT; Schema: public; Owner: sam
--

COMMENT ON COLUMN public.users.encrypted_alias IS 'Alias encrypted with user password (user-only access)';


--
-- Name: COLUMN users.encrypted_client_name; Type: COMMENT; Schema: public; Owner: sam
--

COMMENT ON COLUMN public.users.encrypted_client_name IS 'Client name encrypted with user password (user-only access)';


--
-- Name: COLUMN users.encrypted_two_factor_secret; Type: COMMENT; Schema: public; Owner: sam
--

COMMENT ON COLUMN public.users.encrypted_two_factor_secret IS '2FA secret encrypted with user password (user-only access)';


--
-- Name: COLUMN users.encrypted_backup_codes; Type: COMMENT; Schema: public; Owner: sam
--

COMMENT ON COLUMN public.users.encrypted_backup_codes IS '2FA backup codes encrypted with user password (user-only access)';


--
-- Name: COLUMN users.admin_encrypted_email; Type: COMMENT; Schema: public; Owner: sam
--

COMMENT ON COLUMN public.users.admin_encrypted_email IS 'Email encrypted with master key (admin access for support)';


--
-- Name: COLUMN users.admin_encrypted_alias; Type: COMMENT; Schema: public; Owner: sam
--

COMMENT ON COLUMN public.users.admin_encrypted_alias IS 'Alias encrypted with master key (admin access for support)';


--
-- Name: COLUMN users.admin_encrypted_client_name; Type: COMMENT; Schema: public; Owner: sam
--

COMMENT ON COLUMN public.users.admin_encrypted_client_name IS 'Client name encrypted with master key (admin access for support)';


--
-- Name: COLUMN users.admin_encrypted_two_factor_secret; Type: COMMENT; Schema: public; Owner: sam
--

COMMENT ON COLUMN public.users.admin_encrypted_two_factor_secret IS 'TOTP secret encrypted with master key (admin access for password reset)';


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: sam
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO sam;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sam
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: sam
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: users users_email_hash_key; Type: CONSTRAINT; Schema: public; Owner: sam
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_hash_key UNIQUE (email_hash);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: sam
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_users_apex_hierarchy; Type: INDEX; Schema: public; Owner: sam
--

CREATE INDEX idx_users_apex_hierarchy ON public.users USING btree (parent_user_id, subscription_plan) WHERE (parent_user_id IS NOT NULL);


--
-- Name: idx_users_email_hash; Type: INDEX; Schema: public; Owner: sam
--

CREATE INDEX idx_users_email_hash ON public.users USING btree (email_hash);


--
-- Name: idx_users_email_verified; Type: INDEX; Schema: public; Owner: sam
--

CREATE INDEX idx_users_email_verified ON public.users USING btree (email_verified);


--
-- Name: idx_users_is_apex_manager; Type: INDEX; Schema: public; Owner: sam
--

CREATE INDEX idx_users_is_apex_manager ON public.users USING btree (is_apex_manager);


--
-- Name: idx_users_login_method; Type: INDEX; Schema: public; Owner: sam
--

CREATE INDEX idx_users_login_method ON public.users USING btree (login_method_selected);


--
-- Name: idx_users_onboarding_step; Type: INDEX; Schema: public; Owner: sam
--

CREATE INDEX idx_users_onboarding_step ON public.users USING btree (onboarding_step);


--
-- Name: idx_users_parent_user_id; Type: INDEX; Schema: public; Owner: sam
--

CREATE INDEX idx_users_parent_user_id ON public.users USING btree (parent_user_id);


--
-- Name: idx_users_reset_token; Type: INDEX; Schema: public; Owner: sam
--

CREATE INDEX idx_users_reset_token ON public.users USING btree (reset_token);


--
-- Name: idx_users_spaceship_auth_key; Type: INDEX; Schema: public; Owner: sam
--

CREATE INDEX idx_users_spaceship_auth_key ON public.users USING btree (spaceship_auth_key);


--
-- Name: idx_users_stripe_customer_id; Type: INDEX; Schema: public; Owner: sam
--

CREATE INDEX idx_users_stripe_customer_id ON public.users USING btree (stripe_customer_id);


--
-- Name: idx_users_subscription_plan; Type: INDEX; Schema: public; Owner: sam
--

CREATE INDEX idx_users_subscription_plan ON public.users USING btree (subscription_plan);


--
-- Name: idx_users_two_factor_enabled; Type: INDEX; Schema: public; Owner: sam
--

CREATE INDEX idx_users_two_factor_enabled ON public.users USING btree (two_factor_enabled) WHERE (two_factor_enabled = true);


--
-- Name: idx_users_verification_token; Type: INDEX; Schema: public; Owner: sam
--

CREATE INDEX idx_users_verification_token ON public.users USING btree (verification_token);


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: sam
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users users_parent_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sam
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_parent_user_id_fkey FOREIGN KEY (parent_user_id) REFERENCES public.users(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: sam
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

