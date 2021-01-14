const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bycrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.register = (req, res) => {

    const { acName, acId, acEmail, acPassword, RePassword } = req.body;
    db.query('SELECT EMAIL FROM academy_details WHERE EMAIL = ?', [acEmail], async (err, results) => {
        if (err){
            console.log(err.message);
        }
        if (results.length>0){
            return res.render('register',{
                message: "this email is already in use"
            })
        }
        else if (acPassword != RePassword){
            return res.render('register',{
                message: "your passwords didn't match"
            });
        }

        let hashedPassword = await bycrypt.hash(acPassword,8);
        console.log(hashedPassword);

        db.query('INSERT INTO academy_details SET ?', {ACADEMY_NAME: acName, ACADEMY_ID: acId, EMAIL: acEmail, PASSWORD: hashedPassword}, (err,results)=>{
            if (err){
                console.log(err.message);
            }
            else{
                console.log(results);
                return res.render('register',{
                    message: "succesfully registered!"
                });
            }
        });

    });
    console.log(req.body);
}