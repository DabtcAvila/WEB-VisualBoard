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

--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: davicho
--

INSERT INTO public.posts VALUES (1, 'Post de Prueba', 'Este es un post de prueba para verificar que el sistema funciona', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', 'test-user', '["prueba", "monta\u00f1a", "naturaleza"]', '2025-12-08 21:43:46.874319-06', '2025-12-08 23:02:46.030069-06', true, '2025-12-09 05:02:46.09793-06');
INSERT INTO public.posts VALUES (2, 'Baile de marte', 'un baile inolvidable', 'https://faithful-red-m811vxqede-x90zgcora3.edgeone.dev/1755143073964.jpeg', 'user-p00b9uizz', '["naturaleza", "marte"]', '2025-12-08 21:51:58.252932-06', '2025-12-08 23:02:46.030069-06', false, '2025-12-09 05:02:46.810811-06');
INSERT INTO public.posts VALUES (3, 'Matilda', 'Y así fue', 'https://striking-amber-mq6m4piosy-jn0yte54s1.edgeone.dev/Captura%20de%20pantalla%202025-12-08%20a%20la(s)%2010.39.59%E2%80%AFp.m..png', 'Usuario001', '["destreza", "magia"]', '2025-12-08 22:42:36.142568-06', '2025-12-08 23:02:46.030069-06', true, '2025-12-09 05:02:47.115655-06');
INSERT INTO public.posts VALUES (4, 'Matilda', 'Y así fue', 'https://striking-amber-mq6m4piosy-jn0yte54s1.edgeone.dev/Captura%20de%20pantalla%202025-12-08%20a%20la(s)%2010.39.59%E2%80%AFp.m..png', 'Usuario001', '["destreza", "magia"]', '2025-12-08 22:43:07.855001-06', '2025-12-08 23:02:46.030069-06', true, '2025-12-09 05:02:47.328925-06');
INSERT INTO public.posts VALUES (5, 'Matilda', 'Y así fue', 'https://striking-amber-mq6m4piosy-jn0yte54s1.edgeone.dev/Captura%20de%20pantalla%202025-12-08%20a%20la(s)%2010.39.59%E2%80%AFp.m..png', 'Usuario001', '["destreza", "magia"]', '2025-12-08 22:43:12.667849-06', '2025-12-08 23:02:46.030069-06', true, '2025-12-09 05:02:47.518614-06');
INSERT INTO public.posts VALUES (6, 'Danzarin', 'La danza', 'http://localhost:8000/api/upload/images/20251208_99bef733-a5e4-4578-8c7f-9a98c2ffb879.jpeg', 'Mama123', '["computadoras", "tecnolog\u00eda"]', '2025-12-08 22:55:16.001907-06', '2025-12-08 23:02:46.030069-06', true, '2025-12-09 05:02:47.518678-06');
INSERT INTO public.posts VALUES (8, 'Bailando', 'P2P payments', 'http://localhost:8000/api/upload/images/20251208_652a71c6-4c9f-4b95-a1ea-4128fe0eb854.jpeg', 'Mama123', '["Crypto", "Payments"]', '2025-12-08 22:57:49.529875-06', '2025-12-08 23:02:46.030069-06', true, '2025-12-09 05:02:47.518712-06');
INSERT INTO public.posts VALUES (7, 'Danzarin 2.0', 'La danza', 'http://localhost:8000/api/upload/images/20251208_613043b2-c264-49a4-9a87-37055f6cf566.jpeg', 'Mama123', '["computadoras", "tecnolog\u00eda"]', '2025-12-08 22:55:24.455979-06', '2025-12-08 23:10:03.444738-06', true, '2025-12-09 05:02:47.518698-06');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: davicho
--

INSERT INTO public.users VALUES (1, 'Usuario001', 'usuario001@fotos.com', 'Usuario 001', '96cae35ce8a9b0244178bf28e4966c2ce1b8385723a96a6b838858cdd6ca0a1e', '2025-12-08 22:38:53.443033-06', '2025-12-09 04:45:07.802365-06');
INSERT INTO public.users VALUES (2, 'Mama123', 'mama@fotos.com', 'Mama 123', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2025-12-08 22:45:53.798039-06', NULL);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: davicho
--

SELECT pg_catalog.setval('public.posts_id_seq', 8, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: davicho
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- PostgreSQL database dump complete
--

