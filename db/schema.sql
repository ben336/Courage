DROP TABLE PEOPLE;
DROP TABLE CAMPAIGN;
DROP TABLE MESSAGE;


CREATE TYPE GENDER AS ENUM ('male', 'female');



CREATE TABLE PEOPLE(
	ID SERIAL PRIMARY KEY,
	firstname VARCHAR(32),
	lastname VARCHAR(32),
	email VARCHAR(64),
	birthday DATE,
	gender GENDER,
	/*
		Member Types are INTs
		Initially I'm thinking
		0 - not a member
		1 - basic member
		with room to expand
	*/
	membertype INT2,
	-- the date the person joined (if a member)
	joindate DATE,
	GOOGLEID VARCHAR(100) UNIQUE
);


CREATE TABLE CAMPAIGN(
	ID SERIAL PRIMARY KEY,
	Name VARCHAR(100),
	Description TEXT,
	/* Owner and Target refer to an ID in the people field,
		but no foreign keys for now*/
	OWNER INTEGER NOT NULL,
	TARGET INTEGER NOT NULL,
	STARTDATE DATE,
	ENDDATE DATE,
	SHOWDATE DATE,
	/*
		Visibility is an INT
		Initially I'm thinking
		0 - private
		1 - public
		with room to expand
	*/
	VISIBLITY INT2,
	/** hash to allow viewing of private campaign */
	KEY VARCHAR(100)
);


CREATE TABLE MESSAGE(
	ID SERIAL PRIMARY KEY,
	WRITER INTEGER NOT NULL,
	/** Enforce message length in code, not DB */
	MESSAGE TEXT,
	WRITEDATE DATE,
	/*
		Visibility is an INT
		Initially I'm thinking
		0 - private
		1 - public
		with room to expand
	*/
	VISIBLITY INT2
);

