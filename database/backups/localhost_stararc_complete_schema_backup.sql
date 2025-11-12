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

ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_parent_user_id_fkey;
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP INDEX IF EXISTS public.idx_users_verification_token;
DROP INDEX IF EXISTS public.idx_users_two_factor_enabled;
DROP INDEX IF EXISTS public.idx_users_subscription_plan;
DROP INDEX IF EXISTS public.idx_users_stripe_customer_id;
DROP INDEX IF EXISTS public.idx_users_spaceship_auth_key;
DROP INDEX IF EXISTS public.idx_users_reset_token;
DROP INDEX IF EXISTS public.idx_users_parent_user_id;
DROP INDEX IF EXISTS public.idx_users_onboarding_step;
DROP INDEX IF EXISTS public.idx_users_login_method;
DROP INDEX IF EXISTS public.idx_users_is_apex_manager;
DROP INDEX IF EXISTS public.idx_users_email_verified;
DROP INDEX IF EXISTS public.idx_users_email;
DROP INDEX IF EXISTS public.idx_users_apex_hierarchy;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP FUNCTION IF EXISTS public.update_updated_at_column();
DROP EXTENSION IF EXISTS "uuid-ossp";
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
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
    client_name character varying(255) DEFAULT NULL::character varying,
    max_managed_accounts integer DEFAULT 30,
    two_factor_secret character varying(32),
    two_factor_enabled boolean DEFAULT false,
    two_factor_backup_codes text[],
    two_factor_enabled_at timestamp without time zone,
    CONSTRAINT check_apex_hierarchy CHECK (((parent_user_id IS NULL) OR ((parent_user_id IS NOT NULL) AND ((subscription_plan)::text = 'Core'::text)))),
    CONSTRAINT check_apex_manager_subscription CHECK (((is_apex_manager = false) OR ((is_apex_manager = true) AND ((subscription_plan)::text = 'Apex'::text)))),
    CONSTRAINT check_login_method CHECK (((login_method_selected IS NULL) OR ((login_method_selected)::text = ANY ((ARRAY['standard'::character varying, 'privacy'::character varying])::text[])))),
    CONSTRAINT check_onboarding_step CHECK (((onboarding_step)::text = ANY ((ARRAY['registration'::character varying, 'subscription_selection'::character varying, 'auth_method_selection'::character varying, 'completed'::character varying])::text[]))),
    CONSTRAINT check_subscription_plan CHECK (((subscription_plan)::text = ANY ((ARRAY['Free'::character varying, 'Spark'::character varying, 'Core'::character varying, 'Apex'::character varying, 'ApexChild'::character varying])::text[])))
);


--
-- Name: TABLE users; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.users IS 'User accounts with privacy-by-design approach';


--
-- Name: COLUMN users.stripe_customer_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.stripe_customer_id IS 'Stripe customer ID for payment management - replaces complex billing tables';


--
-- Name: COLUMN users.spaceship_auth_key; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.spaceship_auth_key IS 'AES-GCM encrypted auth key for Spaceship access (JSON: {iv, tag, data})';


--
-- Name: COLUMN users.onboarding_step; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.onboarding_step IS 'Current step in user onboarding process';


--
-- Name: COLUMN users.login_method_selected; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.login_method_selected IS 'Selected authentication method: standard or privacy';


--
-- Name: COLUMN users.spaceship_integration_completed; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.spaceship_integration_completed IS 'Whether Spaceship app integration is completed';


--
-- Name: COLUMN users.parent_user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.parent_user_id IS 'Reference to parent Apex manager for ApexChild accounts';


--
-- Name: COLUMN users.is_apex_manager; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.is_apex_manager IS 'Indicates if user is an Apex subscription manager';


--
-- Name: COLUMN users.client_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.client_name IS 'Display name for ApexChild accounts (client identification)';


--
-- Name: COLUMN users.max_managed_accounts; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.max_managed_accounts IS 'Maximum number of ApexChild accounts this Apex user can manage';


--
-- Name: COLUMN users.two_factor_secret; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.two_factor_secret IS 'Base32-encoded TOTP secret for 2FA authentication';


--
-- Name: COLUMN users.two_factor_enabled; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.two_factor_enabled IS 'Whether 2FA is enabled for this user';


--
-- Name: COLUMN users.two_factor_backup_codes; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.two_factor_backup_codes IS 'Array of one-time backup codes for 2FA recovery';


--
-- Name: COLUMN users.two_factor_enabled_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.two_factor_enabled_at IS 'Timestamp when 2FA was first enabled';


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_users_apex_hierarchy; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_apex_hierarchy ON public.users USING btree (parent_user_id, subscription_plan) WHERE (parent_user_id IS NOT NULL);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_email_verified; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_email_verified ON public.users USING btree (email_verified);


--
-- Name: idx_users_is_apex_manager; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_is_apex_manager ON public.users USING btree (is_apex_manager);


--
-- Name: idx_users_login_method; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_login_method ON public.users USING btree (login_method_selected);


--
-- Name: idx_users_onboarding_step; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_onboarding_step ON public.users USING btree (onboarding_step);


--
-- Name: idx_users_parent_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_parent_user_id ON public.users USING btree (parent_user_id);


--
-- Name: idx_users_reset_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_reset_token ON public.users USING btree (reset_token);


--
-- Name: idx_users_spaceship_auth_key; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_spaceship_auth_key ON public.users USING btree (spaceship_auth_key);


--
-- Name: idx_users_stripe_customer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_stripe_customer_id ON public.users USING btree (stripe_customer_id);


--
-- Name: idx_users_subscription_plan; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_subscription_plan ON public.users USING btree (subscription_plan);


--
-- Name: idx_users_two_factor_enabled; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_two_factor_enabled ON public.users USING btree (two_factor_enabled) WHERE (two_factor_enabled = true);


--
-- Name: idx_users_verification_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_verification_token ON public.users USING btree (verification_token);


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users users_parent_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_parent_user_id_fkey FOREIGN KEY (parent_user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

