const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bycrypt = require('bcryptjs');
//const emailValidator = require('deep-email-validator');
const alert = require('alert');
const math = require('mathjs');
const check_auth = require('../public/js/check_auth');


// async function isEmailValid(email) {
//     return await emailValidator.validate(email);
// }

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.register = async (req, res) => {

    const { acName, acId, acEmail, acPassword, RePassword } = req.body;
    // const { valid, reason, validators } = await isEmailValid(acEmail);
    // console.log(isEmailValid(acEmail));
    // console.log(valid,reason,validators);
    db.query('SELECT id FROM valid_academy WHERE id = ?', [acId], async (err, results) => {
        if (err) {
            //console.log(err.message);
            return res.render('register', {
                message: "check your internet or duplicate entry."
            });
        }

        else if (results.length <= 0) {
            return res.render('register', {
                message: "the academy id you gave was invalid"
            });
        }


        // else if (!valid) {
        //     return res.render('register', {
        //         message: "the email you gave was not valid! or your internet is broken!"
        //     });
        // }

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
    //console.log(req.body);
}

exports.login = async (req, res) => {
    try {
        const { id, password } = req.body;

        //console.log(req.body);

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


                //console.log("the token is " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                db.query('SELECT * FROM match_news ORDER BY id DESC LIMIT 5',(err,results)=>{
                    var data=[];
                    if(err || results.length<=0){
                        data.push({description:"none",result:"none",score1:"none",score2:"none"});
                    }
                    else{
                        for(var i=0;i<results.length;i++){
                            data.push({description:results[i].description,
                                result:results[i].result,
                                score1:results[i].score1,
                                score2:results[i].score2});
                        }
                    }
                    res.render("index_admin",{data:data});
                });
            }
        });
    } catch (err) {
        console.log(err.message);
        return res.render('login', {
            message: "check your internet or duplicate entry."
        });
    }
}

exports.add_player = async (req, res) => {
    try {
        const { Name, BirthDate, PlayerId, Email, PlayersContact, PlayersGardiansContact,
            PlayingRole, BattingStyle, BowlingStyle, Image } = req.body;

        //console.log(req.body);
        
        const token = req.cookies.jwt;
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.userData = decoded;
        var AcademyId = req.userData.id.toString();
        console.log(AcademyId);


        db.query('INSERT INTO players_details SET ?', {
            AcademyId: AcademyId, 
            Name: Name,
            BirthDate: BirthDate, PlayerId: PlayerId, Email: Email,
            PlayersContact: PlayersContact, PlayersGardiansContact: PlayersGardiansContact,
            PlayingRole: PlayingRole, BattingStyle: BattingStyle,
            BowlingStyle: BowlingStyle, Image: Image
        }, (err, results) => {

            if (err) {
                return res.render('add_player', {
                    message: "check your internet or duplicate entry."
                });
            }
            else {
                return res.render('add_player', {
                    message: "succesfully registered!"
                });
            }

        });

    } catch (error) {
        console.log(error.message);
    }
}



exports.add_batting_record = async (req, res) => {
    try {
        const { player_id, match_type,dots,ones,twos,threes,fours,sixes, out_status,date } = req.body;

        //console.log(req.body);
        var run_scored = Number(ones)+Number(twos)*2+Number(threes)*3+Number(fours)*4+Number(sixes)*6;
        var bowl_faced = Number(dots)+Number(ones)+Number(twos)+Number(threes)+Number(fours)+Number(sixes);

        db.query('INSERT INTO batsman_record SET ?', {
            player_id: player_id,
            match_type:match_type,
            dots:dots,
            ones:ones,
            twos:twos,
            threes:threes,
            fours:fours,
            sixes:sixes,
            run_scored: run_scored,
            bowl_faced: bowl_faced,
            out_status: out_status,
            strike_rate: (run_scored/bowl_faced) * 100,
            id: player_id+date
        }, (err, results) => {

            if (err) {
                //console.log(err.message);
                return res.render('add_batting_record', {
                    message: "check your internet or duplicate entry."
                });
            }
            else {
                db.query('SELECT * FROM batting_analysis WHERE player_id = ?',[player_id],(err,results)=>{
                    if(err){
                        //console.log(err.message);
                        return res.render('add_batting_record', {
                            message: "check your internet or duplicate entry."
                        });
                    }
                    else if(results.length==0){
                        var out_count=0
                        if(out_status=="OUT"){
                            out_count=1
                        }
                        db.query('INSERT INTO `batting_analysis` SET ?',{
                            player_id:player_id,
                            out_count:Number(out_count),
                            total_run_scored:Number(run_scored),
                            total_bowl_faced:Number(bowl_faced),
                            batting_avg:Number(run_scored),
                            strike_rate:Number(Number(run_scored)/Number(bowl_faced))*100
                        },(err,results)=>{
                            if(err){
                                //console.log(err.message);
                                return res.render('add_batting_record', {
                                    message: "check your internet or duplicate entry."
                                });
                            }
                            else{
                                console.log(results);
                            }
                        });
                    }
                    else{
                        var out_count=0
                        if(out_status=="OUT"){
                            out_count=1
                        }
                        var query='UPDATE `batting_analysis` SET out_count = ?, total_run_scored =  ?,total_bowl_faced = ?,batting_avg = ?,strike_rate = ? WHERE player_id=?';
                        db.query(query,[Number(results[0].out_count)+Number(out_count),
                        Number(results[0].total_run_scored)+Number(run_scored),
                        Number(results[0].total_bowl_faced)+Number(bowl_faced),
                        Number(Number(results[0].total_run_scored)+Number(run_scored))/math.max((Number(results[0].out_count)+Number(out_count)),1),
                        100*Number(Number(results[0].total_run_scored)+Number(run_scored))/(Number(results[0].total_bowl_faced)+Number(bowl_faced)),
                        player_id
                    ],(err,results)=>{
                        if(err){
                            //console.log(err.message);
                            return res.render('add_batting_record', {
                                message: "check your internet or duplicate entry."
                            });
                        }
                        else{
                            //console.log(results);
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
        //console.log(error.message);
        return res.render('add_batting_record', {
            message: "check your internet or duplicate entry."
        });
    }
}


exports.add_bowling_record = async (req, res) => {
    try {
        const { player_id,match_type,maiden,wicket, over_bowled, run_cost,date } = req.body;

        //console.log(req.body);

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
                return res.render('add_bowling_record', {
                    message: "check your internet or duplicate entry."
                });
            }
            else {
                db.query('SELECT * FROM bowling_analysis WHERE player_id = ?',[player_id],(err,results)=>{
                    if(err){
                        console.log(err.message);
                        return res.render('add_bowling_record', {
                            message: "check your internet or duplicate entry."
                        });
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
                                return res.render('add_bowling_record', {
                                    message: "check your internet or duplicate entry."
                                });
                            }
                            else{
                                //console.log(results);
                            }
                        });
                    }
                    else{
                        var query='UPDATE `bowling_analysis` SET total_wicket = ?, total_run =  ?,total_over = ?,bowling_avg = ?,economy = ? WHERE player_id=?';
                        db.query(query,[Number(results[0].total_wicket)+Number(wicket),
                        Number(results[0].total_run)+Number(run_cost),
                        Number(results[0].total_over)+Number(over_bowled),
                        Number(Number(results[0].total_run)+Number(run_cost))/math.max((Number(results[0].total_wicket)+Number(wicket)),1),
                        Number(Number(results[0].total_run)+Number(run_cost))/(Number(results[0].total_over)+Number(over_bowled)),
                        player_id
                    ],(err,results)=>{
                        if(err){
                            //console.log(err.message);
                            return res.render('add_bowling_record', {
                                message: "check your internet or duplicate entry."
                            });
                        }
                        else{
                            //console.log(results);
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
        //console.log(error.message);
        return res.render('add_bowling_record', {
            message: "check your internet or duplicate entry."
        });
    }
}

exports.player_search_details = (req,res)=>{
    try {
        const search_item = req.body.search_item;
        //console.log(req.body,search_item);
        db.query('SELECT * FROM players_details,bowling_analysis,batting_analysis WHERE players_details.Name=? AND players_details.PlayerId=batting_analysis.player_id  LIMIT 1',[search_item],(err,results)=>{
            
            //console.log(results);
            if(err || results.length<=0){
                var data=[];
                data.push({academy_id:"not found",
                player_name:"not found",
                playing_role:"not found",
                total_wicket:"not found",
                bowling_avg:"not found",
                economy:"not found",
                total_run:"not found",
                batting_avg:"not found",
                strike_rate:"not found"});
                return res.render('player_search_details',{data:data});
            }

            
            
            var data=[];
            //console.log(results[0]);
            data.push({
                academy_id:results[0].AcademyId,
                player_name:results[0].Name,
                playing_role:results[0].PlayingRole,
                total_wicket:results[0].total_wicket,
                bowling_avg:results[0].bowling_avg,
                economy:results[0].economy,
                total_run:results[0].total_run,
                batting_avg:results[0].batting_avg,
                strike_rate:results[0].strike_rate
            });
            return res.render('player_search_details',{data:data});
        });
        
    } catch (error) {
        console.log(err.message);
    }
}

exports.player_search_details_ad = (req,res)=>{
    try {
        const search_item = req.body.search_item;
        //console.log(req.body,search_item);
        db.query('SELECT * FROM players_details,bowling_analysis,batting_analysis WHERE players_details.Name=? AND players_details.PlayerId=batting_analysis.player_id  LIMIT 1',[search_item],(err,results)=>{
            
            //console.log(results);
            if(err || results.length<=0){
                var data=[];
                data.push({academy_id:"not found",
                player_name:"not found",
                playing_role:"not found",
                total_wicket:"not found",
                bowling_avg:"not found",
                economy:"not found",
                total_run:"not found",
                batting_avg:"not found",
                strike_rate:"not found"});
                return res.render('player_search_details_ad',{data:data});
            }

            
            
            var data=[];
            //console.log(results[0]);
            data.push({
                academy_id:results[0].AcademyId,
                player_name:results[0].Name,
                playing_role:results[0].PlayingRole,
                total_wicket:results[0].total_wicket,
                bowling_avg:results[0].bowling_avg,
                economy:results[0].economy,
                total_run:results[0].total_run,
                batting_avg:results[0].batting_avg,
                strike_rate:results[0].strike_rate
            });
            return res.render('player_search_details_ad',{data:data});
        });
        
    } catch (error) {
        console.log(err.message);
    }
}