--
-- PostgreSQL database dump
--

-- Dumped from database version 15.14 (Homebrew)
-- Dumped by pg_dump version 16.9 (Homebrew)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: davicho
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    image_url character varying(500) NOT NULL,
    user_id character varying(100) NOT NULL,
    tags text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    is_active boolean DEFAULT true NOT NULL,
    last_image_check timestamp with time zone
);


ALTER TABLE public.posts OWNER TO davicho;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: davicho
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.posts_id_seq OWNER TO davicho;

--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: davicho
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: davicho
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    full_name character varying(100),
    password_hash character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    last_login timestamp with time zone
);


ALTER TABLE public.users OWNER TO davicho;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: davicho
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO davicho;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: davicho
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: davicho
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: davicho
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: davicho
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: davicho
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: davicho
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_posts_id; Type: INDEX; Schema: public; Owner: davicho
--

CREATE INDEX ix_posts_id ON public.posts USING btree (id);


--
-- Name: ix_posts_user_id; Type: INDEX; Schema: public; Owner: davicho
--

CREATE INDEX ix_posts_user_id ON public.posts USING btree (user_id);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: davicho
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: ix_users_username; Type: INDEX; Schema: public; Owner: davicho
--

CREATE UNIQUE INDEX ix_users_username ON public.users USING btree (username);


--
-- PostgreSQL database dump complete
--

