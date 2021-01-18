const express = require('express');
const router = express.Router();

router.get('/',(req,res) =>{
    res.render("index");
});

router.get('/index_admin',(req,res) =>{
    res.render("index_admin");
});

router.get('/register',(req,res) =>{
    res.render("register");
});

router.get('/login',(req,res) =>{
    res.render("login");
});

router.get('/top_bowler_gen',(req,res) =>{
    res.render("top_bowler_gen");
});

router.get('/top_batsman_gen',(req,res) =>{
    res.render("top_batsman_gen");
});

router.get('/top_allrounder_gen',(req,res) =>{
    res.render("top_allrounder_gen");
});

router.get('/add_player',(req,res) =>{
    res.render("add_player");
});

router.get('/add_record',(req,res) =>{
    res.render("add_record");
});

module.exports = router;