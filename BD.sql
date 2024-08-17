
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- public.expected_results definition

-- Drop table

-- DROP TABLE public.expected_results;

CREATE TABLE public.expected_results (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	description text NOT NULL,
	CONSTRAINT expected_results_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.expected_results OWNER TO postgres;
GRANT ALL ON TABLE public.expected_results TO postgres;


-- public.test_actions definition

-- Drop table

-- DROP TABLE public.test_actions;

CREATE TABLE public.test_actions (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	description text NOT NULL,
	CONSTRAINT test_actions_pkey PRIMARY KEY (id),
	CONSTRAINT unique_action_description UNIQUE (description)
);

-- Permissions

ALTER TABLE public.test_actions OWNER TO postgres;
GRANT ALL ON TABLE public.test_actions TO postgres;


-- public.test_suite_level_1 definition

-- Drop table

-- DROP TABLE public.test_suite_level_1;

CREATE TABLE public.test_suite_level_1 (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT test_suite_level_1_name_key UNIQUE (name),
	CONSTRAINT test_suite_level_1_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.test_suite_level_1 OWNER TO postgres;
GRANT ALL ON TABLE public.test_suite_level_1 TO postgres;


-- public.test_suite_level_2 definition

-- Drop table

-- DROP TABLE public.test_suite_level_2;

CREATE TABLE public.test_suite_level_2 (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(255) NOT NULL,
	level_1_id uuid NOT NULL,
	CONSTRAINT test_suite_level_2_name_key UNIQUE (name),
	CONSTRAINT test_suite_level_2_pkey PRIMARY KEY (id),
	CONSTRAINT test_suite_level_2_level_1_id_fkey FOREIGN KEY (level_1_id) REFERENCES public.test_suite_level_1(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.test_suite_level_2 OWNER TO postgres;
GRANT ALL ON TABLE public.test_suite_level_2 TO postgres;


-- public.test_case definition

-- Drop table

-- DROP TABLE public.test_case;

CREATE TABLE public.test_case (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(255) NOT NULL,
	importance varchar(10) NOT NULL,
	summary text NOT NULL,
	preconditions text NOT NULL,
	level_2_id uuid NOT NULL,
	CONSTRAINT test_case_importance_check CHECK (((importance)::text = ANY ((ARRAY['Low'::character varying, 'Medium'::character varying, 'High'::character varying])::text[]))),
	CONSTRAINT test_case_pkey PRIMARY KEY (id),
	CONSTRAINT test_case_level_2_id_fkey FOREIGN KEY (level_2_id) REFERENCES public.test_suite_level_2(id) ON DELETE CASCADE
);
CREATE INDEX idx_importance ON public.test_case USING btree (importance);

-- Permissions

ALTER TABLE public.test_case OWNER TO postgres;
GRANT ALL ON TABLE public.test_case TO postgres;


-- public.test_case_actions definition

-- Drop table

-- DROP TABLE public.test_case_actions;

CREATE TABLE public.test_case_actions (
	test_case_id uuid NOT NULL,
	action_id uuid NOT NULL,
	"sequence" int4 NOT NULL,
	CONSTRAINT test_case_actions_pkey PRIMARY KEY (test_case_id, action_id),
	CONSTRAINT test_case_actions_action_id_fkey FOREIGN KEY (action_id) REFERENCES public.test_actions(id) ON DELETE CASCADE,
	CONSTRAINT test_case_actions_test_case_id_fkey FOREIGN KEY (test_case_id) REFERENCES public.test_case(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.test_case_actions OWNER TO postgres;
GRANT ALL ON TABLE public.test_case_actions TO postgres;


-- public.test_case_expected_results definition

-- Drop table

-- DROP TABLE public.test_case_expected_results;

CREATE TABLE public.test_case_expected_results (
	test_case_id uuid NOT NULL,
	expected_result_id uuid NOT NULL,
	CONSTRAINT test_case_expected_results_pkey PRIMARY KEY (test_case_id, expected_result_id),
	CONSTRAINT test_case_expected_results_expected_result_id_fkey FOREIGN KEY (expected_result_id) REFERENCES public.expected_results(id) ON DELETE CASCADE,
	CONSTRAINT test_case_expected_results_test_case_id_fkey FOREIGN KEY (test_case_id) REFERENCES public.test_case(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.test_case_expected_results OWNER TO postgres;
GRANT ALL ON TABLE public.test_case_expected_results TO postgres;
