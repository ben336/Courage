CREATE TYPE GENDER AS ENUM ('male', 'female');

CREATE TABLE PEOPLE(
	ID VARCHAR(100) PRIMARY KEY,
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
	joindate DATE
);

