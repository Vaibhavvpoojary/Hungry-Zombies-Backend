--
-- PostgreSQL database dump
--

\restrict LsquwXfvxRK1kUFWYjpnoGUrdmNcOFchixzO7eT4tLugMgiUNH18eIfa1aqAfVl

-- Dumped from database version 17.10 (Homebrew)
-- Dumped by pg_dump version 17.10 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- Name: categories; Type: TABLE; Schema: public; Owner: vaibhavvpoojary
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    image character varying(255)
);


ALTER TABLE public.categories OWNER TO vaibhavvpoojary;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: vaibhavvpoojary
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO vaibhavvpoojary;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vaibhavvpoojary
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: foods; Type: TABLE; Schema: public; Owner: vaibhavvpoojary
--

CREATE TABLE public.foods (
    id integer NOT NULL,
    category_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    rating numeric(2,1) DEFAULT 0.0,
    is_veg boolean DEFAULT true,
    image character varying(255)
);


ALTER TABLE public.foods OWNER TO vaibhavvpoojary;

--
-- Name: foods_id_seq; Type: SEQUENCE; Schema: public; Owner: vaibhavvpoojary
--

CREATE SEQUENCE public.foods_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.foods_id_seq OWNER TO vaibhavvpoojary;

--
-- Name: foods_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vaibhavvpoojary
--

ALTER SEQUENCE public.foods_id_seq OWNED BY public.foods.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: vaibhavvpoojary
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    food_id integer NOT NULL,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL
);


ALTER TABLE public.order_items OWNER TO vaibhavvpoojary;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: vaibhavvpoojary
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO vaibhavvpoojary;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vaibhavvpoojary
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: vaibhavvpoojary
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer NOT NULL,
    order_type character varying(20) NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    status character varying(30) DEFAULT 'Pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.orders OWNER TO vaibhavvpoojary;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: vaibhavvpoojary
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO vaibhavvpoojary;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vaibhavvpoojary
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: vaibhavvpoojary
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(15) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO vaibhavvpoojary;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: vaibhavvpoojary
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO vaibhavvpoojary;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vaibhavvpoojary
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: vaibhavvpoojary
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: foods id; Type: DEFAULT; Schema: public; Owner: vaibhavvpoojary
--

ALTER TABLE ONLY public.foods ALTER COLUMN id SET DEFAULT nextval('public.foods_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: vaibhavvpoojary
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: vaibhavvpoojary
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: vaibhavvpoojary
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: vaibhavvpoojary
--

COPY public.categories (id, name, description, image) FROM stdin;
1	Burger	Delicious burgers	burger.png
2	Pizza	Fresh oven baked pizzas	pizza.png
3	Drinks	Cold and refreshing beverages	drinks.png
4	Desserts	Sweet desserts	desserts.png
5	Snacks	Quick snacks	snacks.png
\.


--
-- Data for Name: foods; Type: TABLE DATA; Schema: public; Owner: vaibhavvpoojary
--

COPY public.foods (id, category_id, name, description, price, rating, is_veg, image) FROM stdin;
1	1	Classic Burger	Grilled veg burger	149.00	4.5	t	burger.png
2	1	Chicken Burger	Chicken patty burger	199.00	4.7	f	chicken_burger.png
3	2	Margherita Pizza	Cheesy delight	299.00	4.6	t	pizza.png
4	2	Pepperoni Pizza	Loaded pepperoni pizza	399.00	4.8	f	pepperoni.png
5	3	Coke	Chilled Coca Cola	60.00	4.4	t	coke.png
6	4	Chocolate Brownie	Rich chocolate brownie	129.00	4.9	t	brownie.png
7	5	French Fries	Crispy fries	99.00	4.3	t	fries.png
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: vaibhavvpoojary
--

COPY public.order_items (id, order_id, food_id, quantity, price) FROM stdin;
1	1	1	2	149.00
2	1	3	1	299.00
3	1	5	3	60.00
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: vaibhavvpoojary
--

COPY public.orders (id, user_id, order_type, total_amount, status, created_at) FROM stdin;
1	1	Parcel	647.00	Pending	2026-08-06 15:37:27.465613
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: vaibhavvpoojary
--

COPY public.users (id, name, email, phone, password, created_at) FROM stdin;
1	VaibhavVPoojary	vaibhavpoojary2005@gmail.com	8904841712	8904841712	2026-08-06 14:59:11.375379
3	Vaibhav	vaibhav@example.com	9876543210	12345678	2026-08-07 13:22:37.860676
10	Vaibhav Vittala Shantha	vaibhavvpoojary2005@gmail.com	9845715077	8904841712	2026-08-07 14:38:18.923492
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vaibhavvpoojary
--

SELECT pg_catalog.setval('public.categories_id_seq', 5, true);


--
-- Name: foods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vaibhavvpoojary
--

SELECT pg_catalog.setval('public.foods_id_seq', 7, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vaibhavvpoojary
--

SELECT pg_catalog.setval('public.order_items_id_seq', 3, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vaibhavvpoojary
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vaibhavvpoojary
--

SELECT pg_catalog.setval('public.users_id_seq', 10, true);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: vaibhavvpoojary
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: vaibhavvpoojary
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: foods foods_pkey; Type: CONSTRAINT; Schema: public; Owner: vaibhavvpoojary
--

ALTER TABLE ONLY public.foods
    ADD CONSTRAINT foods_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: vaibhavvpoojary
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: vaibhavvpoojary
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: vaibhavvpoojary
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: public; Owner: vaibhavvpoojary
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: vaibhavvpoojary
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: foods fk_category; Type: FK CONSTRAINT; Schema: public; Owner: vaibhavvpoojary
--

ALTER TABLE ONLY public.foods
    ADD CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: order_items fk_food; Type: FK CONSTRAINT; Schema: public; Owner: vaibhavvpoojary
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fk_food FOREIGN KEY (food_id) REFERENCES public.foods(id) ON DELETE CASCADE;


--
-- Name: order_items fk_order; Type: FK CONSTRAINT; Schema: public; Owner: vaibhavvpoojary
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: orders fk_user; Type: FK CONSTRAINT; Schema: public; Owner: vaibhavvpoojary
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict LsquwXfvxRK1kUFWYjpnoGUrdmNcOFchixzO7eT4tLugMgiUNH18eIfa1aqAfVl

