const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bycrypt = require('bcryptjs');
const emailValidator = require('deep-email-validator');
const alert = require('alert');


async function isEmailValid(email) {
    return await emailValidator.validate(email);
}

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.register = async (req, res) => {

    const { acName, acId, acEmail, acPassword, RePassword } = req.body;
    const { valid, reason, validators } = await isEmailValid(acEmail);
    //console.log(isEmailValid(acEmail));
    console.log(valid,reason,validators);
    db.query('SELECT id FROM valid_academy WHERE id = ?', [acId], async (err, results) => {
        if (err) {
            console.log(err.message);
        }

        else if (results.length <= 0) {
            return res.render('register', {
                message: "the academy id you gave was invalid"
            });
        }


        else if (!valid) {
            return res.render('register', {
                message: "the email you gave was not valid!"
            });
        }

        else if (acPassword != RePassword) {
            return res.render('register', {
                message: "your passwords didn't match"
            });
        }

        let hashedPassword = await bycrypt.hash(acPassword, 8);
        console.log("hashed password " + hashedPassword);

        db.query('INSERT INTO academy_details SET ?', { ACADEMY_NAME: acName, ACADEMY_ID: acId, EMAIL: acEmail, PASSWORD: hashedPassword }, (err, results) => {
            if (err) {
                return res.render('register', {
                    message: "your academyId or email is already in use"
                });
            }
            else {
                console.log(results);
                return res.render('register', {
                    message: "succesfully registered!"
                });
            }
        });

    });
    console.log(req.body);
}

exports.login = async (req, res) => {
    try {
        const { id, password } = req.body;

        console.log(req.body);

        db.query('SELECT * FROM academy_details WHERE ACADEMY_ID = ?', [id], async (err, results) => {
            //console.log(results);
            if (results.length == 0 || !(await bycrypt.compare(password, results[0].PASSWORD))) {
                res.status(401).render('login', {
                    message: "id or password is incorrect"
                })

            }
            else {
                const id = results[0].ACADEMY_ID;
                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });


                console.log("the token is " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).render("index_admin");
            }
        });
    } catch (err) {
        console.log(err.message);
    }
}

exports.add_player = async (req, res) => {
    try {
        const { AcademyId, Name, BirthDate, PlayerId, Email, PlayersContact, PlayersGardiansContact,
            PlayingRole, BattingStyle, BowlingStyle, Image } = req.body;

        console.log(req.body);

        db.query('INSERT INTO players_details SET ?', {
            AcademyId: AcademyId, Name: Name,
            BirthDate: BirthDate, PlayerId: PlayerId, Email: Email,
            PlayersContact: PlayersContact, PlayersGardiansContact: PlayersGardiansContact,
            PlayingRole: PlayingRole, BattingStyle: BattingStyle,
            BowlingStyle: BowlingStyle, Image: Image
        }, (err, results) => {

            if (err) {
                console.log(err.message);
            }
            else {
                return res.render('add_player', {
                    message: "succesfully registered!"
                });
            }

        });

    } catch (error) {
        console.log(err.message);
    }
}



exports.add_batting_record = async (req, res) => {
    try {
        const { player_id, run_scored, match_type,dots,ones,twos,threes,fours,sixes,bowl_faced, out_status,date } = req.body;

        console.log(req.body);

        db.query('INSERT INTO batsman_record SET ?', {
            player_id: player_id,
            match_type:match_type,
            dots:dots,
            ones:ones,
            twos:twos,
            threes:threes,
            fours:fours,
            sixes:sixes,
            run_scored: Number(run_scored),
            bowl_faced: Number(bowl_faced),
            out_status: out_status,
            strike_rate: Number(run_scored)/Number(bowl_faced) * 100,
            id: player_id+date
        }, (err, results) => {

            if (err) {
                console.log(err.message);
            }
            else {
                db.query('SELECT * FROM batting_analysis WHERE player_id = ?',[player_id],(err,results)=>{
                    if(err){
                        console.log(err.message);
                    }
                    else if(results.length==0){
                        var notout_count=0
                        if(out_status=="NOT_OUT"){
                            notout_count=1
                        }
                        db.query('INSERT INTO `batting_analysis` SET ?',{
                            player_id:player_id,
                            notout_count:Number(notout_count),
                            total_run_scored:Number(run_scored),
                            total_bowl_faced:Number(bowl_faced),
                            batting_avg:Number(run_scored),
                            strike_rate:Number(Number(run_scored)/Number(bowl_faced))*100
                        },(err,results)=>{
                            if(err){
                                console.log(err.message);
                            }
                            else{
                                console.log(results);
                            }
                        });
                    }
                    else{
                        var notout_count=0
                        if(out_status=="NOT_OUT"){
                            notout_count=1
                        }
                        var query='UPDATE `batting_analysis` SET notout_count = ?, total_run_scored =  ?,total_bowl_faced = ?,batting_avg = ?,strike_rate = ?';
                        db.query(query,[Number(results[0].notout_count)+Number(notout_count),
                        Number(results[0].total_run_scored)+Number(run_scored),
                        Number(results[0].total_bowl_faced)+Number(bowl_faced),
                        Number(Number(results[0].total_run_scored)+Number(run_scored))/(Number(results[0].notout_count)+Number(notout_count)),
                        100*Number(Number(results[0].total_run_scored)+Number(run_scored))/(Number(results[0].total_bowl_faced)+Number(bowl_faced))
                    ],(err,results)=>{
                        if(err){
                            console.log(err.message);
                        }
                        else{
                            console.log(results);
                        }
                    });
                    }
                });
                return res.render('add_batting_record', {
                    message: "succesfully sumitted!"
                });
            }

        });

    } catch (error) {
        console.log(error.message);
    }
}


exports.add_bowling_record = async (req, res) => {
    try {
        const { player_id,match_type,maiden,wicket, over_bowled, run_cost,date } = req.body;

        console.log(req.body);

        db.query('INSERT INTO bowler_record SET ?', {
            player_id: player_id,
            match_type:match_type,
            maiden:maiden,
            wicket:wicket,
            overs: Number(over_bowled),
            run:Number(run_cost),
            economy:Number(run_cost)/Number(over_bowled),
            id: player_id+date
        }, (err, results) => {

            if (err) {
                console.log(err.message);
            }
            else {
                db.query('SELECT * FROM bowling_analysis WHERE player_id = ?',[player_id],(err,results)=>{
                    if(err){
                        console.log(err.message);
                    }
                    else if(results.length==0){
                        db.query('INSERT INTO `bowling_analysis` SET ?',{
                            player_id:player_id,
                            total_wicket:Number(wicket),
                            total_run:Number(run_cost),
                            total_over:Number(over_bowled),
                            bowling_avg:Number(Number(run_cost)/Number(wicket)),
                            economy:Number(Number(run_cost)/Number(over_bowled))
                        },(err,results)=>{
                            if(err){
                                console.log(err.message);
                            }
                            else{
                                console.log(results);
                            }
                        });
                    }
                    else{
                        var query='UPDATE `bowling_analysis` SET total_wicket = ?, total_run =  ?,total_over = ?,bowling_avg = ?,economy = ?';
                        db.query(query,[Number(results[0].total_wicket)+Number(wicket),
                        Number(results[0].total_run)+Number(run_cost),
                        Number(results[0].total_over)+Number(over_bowled),
                        Number(Number(results[0].total_run)+Number(run_cost))/(Number(results[0].total_wicket)+Number(wicket)),
                        Number(Number(results[0].total_run)+Number(run_cost))/(Number(results[0].total_over)+Number(over_bowled))
                    ],(err,results)=>{
                        if(err){
                            console.log(err.message);
                        }
                        else{
                            console.log(results);
                        }
                    });
                    }
                });
                return res.render('add_bowling_record', {
                    message: "succesfully sumitted!"
                });
            }

        });

    } catch (error) {
        console.log(error.message);
    }
}