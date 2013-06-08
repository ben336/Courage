DROP VIEW MOSAIC_VIEW;
DROP VIEW MESSAGE_VIEW;
DROP TABLE PEOPLE;
DROP TABLE MOSAIC;
DROP TABLE MESSAGE;


CREATE TYPE GENDER AS ENUM ('male', 'female');



CREATE TABLE PEOPLE(
	ID SERIAL PRIMARY KEY,
	firstname VARCHAR(32),
	lastname VARCHAR(32),
	email VARCHAR(64) UNIQUE,
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


CREATE TABLE MOSAIC(
	KEY VARCHAR(50) PRIMARY KEY,
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
	VISIBLITY INT2
);


CREATE TABLE MESSAGE(
	ID SERIAL PRIMARY KEY,
	MOSAIC VARCHAR(50),
	WRITER INTEGER NOT NULL,
	/** Enforce message length in code, not DB */
	MESSAGE TEXT,
	SNIPPET VARCHAR(100),
	WRITEDATE DATE,
	/*
		Visibility is an INT
		Initially I'm thinking
		0 - private
		1 - public
		with room to expand
	*/
	VISIBILITY INT2
);

CREATE OR REPLACE VIEW MOSAIC_VIEW AS
select
	mosaic.name,
	mosaic.description,
	mosaic.key,
	owner.firstname as ownerfname,
	owner.lastname as ownerlname,
	owner.id as ownerid,
	owner.email as owneremail,
	target.firstname as targetfname,
	target.lastname as targetlname,
	target.id as targetid,
	target.email as targetemail
from
	mosaic,
	people as owner,
	people as target
where
	mosaic.owner = owner.id
	and
	mosaic.target = target.id;

CREATE OR REPLACE VIEW Message_VIEW AS
select
	message.id,
	message.mosaic as mosaicid,
	message.message,
	message.snippet,
	message.WRITEDATE,
	message.visibility,
	writer.firstname,
	writer.lastname
from
	message,
	people as writer
where
	message.writer = writer.id




