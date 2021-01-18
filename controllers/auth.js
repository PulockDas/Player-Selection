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
    db.query('SELECT id FROM valid_academy WHERE id = ?', [acId],async (err,results)=>{
        if (err) {
           console.log(err.message);
        }

        else if (results.length <= 0) {
            return res.render('register', {
                message: "the academy id you gave was invalid"
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
            console.log(results);
            if (results.length==0 || !(await bycrypt.compare(password, results[0].PASSWORD))) {
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