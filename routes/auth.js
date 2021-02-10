const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/add_player', authController.add_player);

router.post('/add_batting_record', authController.add_batting_record);

router.post('/add_bowling_record', authController.add_bowling_record);

router.post('/player_search_details', authController.player_search_details);

router.post('/player_search_details_ad', authController.player_search_details_ad);

module.exports = router;