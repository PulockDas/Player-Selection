/*
CREAT DATABASE `player_selection`;

CREATE TABLE `valid_academy`(
    id VARCHAR(50),
    PRIMARY KEY(`id`)
);

CREATE TABLE `academy_details`(
    ACADEMY_NAME VARCHAR(50),
    ACADEMY_ID VARCHAR(50),
    EMAIL EMAIL,
    PASSWORD VARCHAR(120),
    PRIMARY KEY(`ACADEMY_ID`)
);


CREATE TABLE `players_details`(
    AcademyId VARCHAR(50),
    Name VARCHAR(30),
    BirthDate VARCHAR(30),
    PlayerID VARCHAR(30),
    Email EMAIL,
    PlayersContact VARCHAR(15),
    PlayersGardiansContact VARCHAR(15),
    PlayingRole VARCHAR(35),
    BattingStyle VARCHAR(50),
    BowlingStyle VARCHAR(50),
    Image MEDIUMBLOB,
    PRIMARY KEY(`PlayerId`),
    FOREIGN KEY(`AcademyID`) REFERENCES academy_details(`ACADEMY_ID`)
);

CREATE TABLE `batsman_record`(
	player_id VARCHAR(30),
    match_type VARCHAR(5),
    dots INT,
    ones INT,
    twos INT,
    threes INT,
    fours INT,
    sixes INT,
    run_scored INT,
    bowl_faced INT,
    out_status VARCHAR(8),
    strike_rate FLOAT,
    id VARCHAR(45),
    PRIMARY KEY(`id`),
    FOREIGN KEY(`player_id`) REFERENCES players_details(`PlayerId`)
);


CREATE TABLE `bowler_record`(
	player_id VARCHAR(30),
    match_type VARCHAR(5),
    maiden INT,
    wicket INT,
    overs INT,
    run INT,
    economy FLOAT,
    id VARCHAR(45),
    PRIMARY KEY(`id`),
    FOREIGN KEY(`player_id`) REFERENCES players_details(`PlayerId`)
);



*/


//all importants dependencies
const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './.env' });

const app = express();

//for our local css,js files
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

db.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    else {
        console.log('connected to database');
    }
});

//we will use hbs view engine for our html files
app.set('view engine', 'hbs');

//using different folder for our routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(5001, () => {
    console.log("server start at port 5001");
});