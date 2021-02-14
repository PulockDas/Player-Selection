const mysql = require('mysql');
const alert = require('alert');
const math = require('mathjs');
const express = require('express');
const router = express.Router();
const check_auth = require('../public/js/check_auth');
const { notDependencies } = require('mathjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

router.get('/', (req, res) => {
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
        res.render("index",{data:data});
    });
    
});

router.get('/logout',check_auth, async(req, res) => {
    res.clearCookie('jwt');
    console.log(req.userData.id);
    db.query('SELECT * FROM match_news ORDER BY id DESC LIMIT 5',(err,results)=>{
        var data=[];
        if(err || results.length<=0){
            data.push({description:"none",result:"none",score1:"none",score2:"none",message:"succesfully logged out!"});
        }
        else{
            for(var i=0;i<results.length;i++){
                data.push({description:results[i].description,
                    result:results[i].result,
                    score1:results[i].score1,
                    score2:results[i].score2});
            }
        }
        return res.render("index",{data:data,message:"succesfully logged out!"});
    });
});

router.get('/index_admin', (req, res) => {
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
});

router.get('/register', (req, res) => {
    res.render("register");
});

router.get('/login', (req, res) => {
    res.render("login");
});

router.get('/top_bowler_gen', (req, res) => {
    //console.log(req.body);
    var query = 'SELECT bowling_analysis.player_id,bowling_analysis.bowling_avg,bowling_analysis.economy, players_details.PlayerId,players_details.Name,players_details.Image,players_details.AcademyId,academy_details.ACADEMY_ID,academy_details.ACADEMY_NAME FROM bowling_analysis,players_details,academy_details WHERE bowling_analysis.player_id=players_details.PlayerId AND players_details.AcademyId=academy_details.ACADEMY_ID ORDER BY bowling_avg ASC, economy ASC LIMIT 15';
    var data = [];
    var b = 0;
    var d = [];

    db.query(query, (err, results) => {
        if (err) {
            console.log(err.message);
            return;
        }
        else {
            //console.log(results);


            for (var i = 0; i < results.length; i++) {
                /*var base = new Buffer.from(results[i].Image);
                var conversion = base.toString('base64');
                var send = '<img src="data:image/png;base64,'+conversion+'" alt="no pic to show"/>';
                console.log(send);*/
                data.push({
                    player_id: results[i].player_id,
                    bowling_avg: results[i].bowling_avg,
                    economy: results[i].economy,
                    name: results[i].Name,
                    academy_name:results[i].ACADEMY_NAME
                });
            }
            //console.log(data);
            res.render("top_bowler_gen", { data: data });
        }
    });
});

router.get('/top_batsman_gen', (req, res) => {


    var query = 'SELECT batting_analysis.player_id,batting_analysis.batting_avg,batting_analysis.strike_rate, players_details.PlayerId,players_details.Name,players_details.Image,players_details.AcademyId,academy_details.ACADEMY_ID,academy_details.ACADEMY_NAME FROM batting_analysis,players_details,academy_details WHERE batting_analysis.player_id=players_details.PlayerId AND academy_details.ACADEMY_ID=players_details.AcademyId ORDER BY batting_avg DESC,strike_rate DESC LIMIT 15';
    var data = [];
    var b = 0;
    var d = [];

    db.query(query, (err, results) => {
        if (err) {
            console.log(err.message);
        }
        else {
            //console.log(results);


            for (var i = 0; i < results.length; i++) {
                /*var base = new Buffer.from(results[i].Image);
                var conversion = base.toString('base64');
                var send = '<img src="data:image/png;base64,'+conversion+'" alt="no pic to show"/>';
                console.log(send);*/
                data.push({
                    player_id: results[i].player_id,
                    batting_avg: results[i].batting_avg,
                    strike_rate: results[i].strike_rate,
                    name: results[i].Name,
                    academy_name:results[i].ACADEMY_NAME
                });
            }
            res.render("top_batsman_gen", { data: data });
        }
    });
});

router.get('/top_allrounder_gen', (req, res) => {
    var query = 'SELECT bowling_analysis.player_id,bowling_analysis.bowling_avg,bowling_analysis.economy, batting_analysis.player_id,batting_analysis.batting_avg,batting_analysis.strike_rate, players_details.PlayerId,players_details.Name,players_details.Image,players_details.AcademyId,academy_details.ACADEMY_NAME,academy_details.ACADEMY_ID FROM batting_analysis,players_details,bowling_analysis,academy_details WHERE batting_analysis.player_id=bowling_analysis.player_id AND batting_analysis.player_id=players_details.PlayerId AND players_details.AcademyId=academy_details.ACADEMY_ID ORDER BY batting_avg DESC,strike_rate DESC, bowling_avg ASC, economy ASC LIMIT 15';
    var data = [];
    var b = 0;
    var d = [];

    db.query(query, (err, results) => {
        if (err) {
            console.log(err.message);
        }
        else {
            //console.log(results);


            for (var i = 0; i < results.length; i++) {
                /*var base = new Buffer.from(results[i].Image);
                var conversion = base.toString('base64');
                var send = '<img src="data:image/png;base64,'+conversion+'" alt="no pic to show"/>';
                console.log(send);*/
                data.push({
                    player_id: results[i].player_id,
                    batting_avg: results[i].batting_avg,
                    strike_rate: results[i].strike_rate,
                    bowling_avg:results[i].bowling_avg,
                    economy:results[i].economy,
                    name: results[i].Name,
                    academy_name:results[i].ACADEMY_NAME
                });
            }
            res.render("top_allrounder_gen", { data: data });
        }
    });
});

router.get('/add_player',check_auth, (req, res) => {
    res.render("add_player");
});

router.get('/add_record',check_auth, (req, res) => {
    res.render("add_record");
});

router.get('/add_batting_record',check_auth, (req, res) => {
    res.render("add_batting_record");
});

router.get('/add_bowling_record',check_auth, (req, res) => {
    res.render("add_bowling_record");
});










router.get('/top_bowler_ad', (req, res) => {
    //console.log(req.body);
    var query = 'SELECT bowling_analysis.player_id,bowling_analysis.bowling_avg,bowling_analysis.economy, players_details.PlayerId,players_details.Name,players_details.Image,players_details.AcademyId,academy_details.ACADEMY_ID,academy_details.ACADEMY_NAME FROM bowling_analysis,players_details,academy_details WHERE bowling_analysis.player_id=players_details.PlayerId AND players_details.AcademyId=academy_details.ACADEMY_ID ORDER BY bowling_avg ASC, economy ASC LIMIT 15';
    var data = [];
    var b = 0;
    var d = [];

    db.query(query, (err, results) => {
        if (err) {
            console.log(err.message);
            return;
        }
        else {
            //console.log(results);


            for (var i = 0; i < results.length; i++) {
                /*var base = new Buffer.from(results[i].Image);
                var conversion = base.toString('base64');
                var send = '<img src="data:image/png;base64,'+conversion+'" alt="no pic to show"/>';
                console.log(send);*/
                data.push({
                    player_id: results[i].player_id,
                    bowling_avg: results[i].bowling_avg,
                    economy: results[i].economy,
                    name: results[i].Name,
                    academy_name:results[i].ACADEMY_NAME
                });
            }
            //console.log(data);
            res.render("top_bowler_ad", { data: data });
        }
    });
});

router.get('/top_batsman_ad', (req, res) => {


    var query = 'SELECT batting_analysis.player_id,batting_analysis.batting_avg,batting_analysis.strike_rate, players_details.PlayerId,players_details.Name,players_details.Image,players_details.AcademyId,academy_details.ACADEMY_ID,academy_details.ACADEMY_NAME FROM batting_analysis,players_details,academy_details WHERE batting_analysis.player_id=players_details.PlayerId AND academy_details.ACADEMY_ID=players_details.AcademyId ORDER BY batting_avg DESC,strike_rate DESC LIMIT 15';
    var data = [];
    var b = 0;
    var d = [];

    db.query(query, (err, results) => {
        if (err) {
            console.log(err.message);
        }
        else {
            //console.log(results);


            for (var i = 0; i < results.length; i++) {
                /*var base = new Buffer.from(results[i].Image);
                var conversion = base.toString('base64');
                var send = '<img src="data:image/png;base64,'+conversion+'" alt="no pic to show"/>';
                console.log(send);*/
                data.push({
                    player_id: results[i].player_id,
                    batting_avg: results[i].batting_avg,
                    strike_rate: results[i].strike_rate,
                    name: results[i].Name,
                    academy_name:results[i].ACADEMY_NAME
                });
            }
            res.render("top_batsman_ad", { data: data });
        }
    });
});

router.get('/top_allrounder_ad', (req, res) => {
    var query = 'SELECT bowling_analysis.player_id,bowling_analysis.bowling_avg,bowling_analysis.economy, batting_analysis.player_id,batting_analysis.batting_avg,batting_analysis.strike_rate, players_details.PlayerId,players_details.Name,players_details.Image,players_details.AcademyId,academy_details.ACADEMY_NAME,academy_details.ACADEMY_ID FROM batting_analysis,players_details,bowling_analysis,academy_details WHERE batting_analysis.player_id=bowling_analysis.player_id AND batting_analysis.player_id=players_details.PlayerId AND players_details.AcademyId=academy_details.ACADEMY_ID ORDER BY batting_avg DESC,strike_rate DESC, bowling_avg ASC, economy ASC LIMIT 15';
    var data = [];
    var b = 0;
    var d = [];

    db.query(query, (err, results) => {
        if (err) {
            console.log(err.message);
        }
        else {
            //console.log(results);


            for (var i = 0; i < results.length; i++) {
                /*var base = new Buffer.from(results[i].Image);
                var conversion = base.toString('base64');
                var send = '<img src="data:image/png;base64,'+conversion+'" alt="no pic to show"/>';
                console.log(send);*/
                data.push({
                    player_id: results[i].player_id,
                    batting_avg: results[i].batting_avg,
                    strike_rate: results[i].strike_rate,
                    bowling_avg:results[i].bowling_avg,
                    economy:results[i].economy,
                    name: results[i].Name,
                    academy_name:results[i].ACADEMY_NAME
                });
            }
            res.render("top_allrounder_ad", { data: data });
        }
    });
});



module.exports = router;