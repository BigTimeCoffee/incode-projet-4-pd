const express = require('express')
const router = express.Router()
const app = express()
const mysql = require('mysql2')
require('dotenv').config()
const password = process.env.PASSWORD
const crypto = require('crypto')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
//const { appendFile } = require('fs')
let token = ''

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: password,
    database: 'incode_project_3',
    port: 3306,
})

router.get('/login', (req, res) => {
    if (app.locals.error) {
        console.log(app.locals.error)
    }
    res.render('login', { layout: 'login' })
})

router.post('/', function (req, res) {
    let email = req.body.email
    let password = crypto
        .createHash('sha256')
        .update(req.body.password)
        .digest('base64')
    if (email && password) {
        connection.query(
            'SELECT * FROM users WHERE email = ? AND password = ?',
            [email, password],
            function (err, result) {
                if (err) throw err
                if (result.length > 0) {
                    console.log(req.cookies)
                    token = jwt.sign(
                        { email: email, password: password },
                        'secretkey',
                        {
                            // secretkey should be env variable
                            expiresIn: '1h',
                        }
                    )
                    res.cookie('jwtCookie', token)
                    console.log('This token will expire in 1 hour: ', token)
                    res.redirect('/')
                } else {
                    let error = 'Incorrect email or password'
                    res.render('login', { layout: 'login', error })
                    //res.redirect('/login')'
                }
            }
        )
    } else {
        let error = 'Please enter required fields'
        res.render('login', { layout: 'login', error })
    }
})

router.get('/', verifyToken, (req, res) => {
    connection.query('SELECT * FROM users', function (err, result) {
        if (err) throw err
        console.log(req.cookies)
        res.render('./main', {
            layout: 'index',
            result,
        })
    })
})

router.get('/signup', (req, res) => {
    res.render('signup', { layout: 'signup' })
})

router.post('/signup', (req, res) => {
    let hash = crypto
        .createHash('sha256')
        .update(req.body.password)
        .digest('base64')
    const userDetails = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hash,
    }
    let dataInsert = 'INSERT INTO users SET ?'
    connection.query(dataInsert, userDetails, function (err, result) {
        if (err) throw err
        console.log('User data is inserted successfully ')
    })
    res.redirect('/')
})

router.get('/scheduleForm', verifyToken, (req, res) => {
    connection.query('SELECT first_name, id FROM users', (err, userData) => {
        if (err) throw err
        res.render('./scheduleForm', {
            layout: 'index',
            userData,
        })
    })
})

router.post('/scheduleForm', (req, res) => {
    const schedulesData = {
        user_id: req.body.user_id,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
    }

    let schedulesInsert = 'INSERT INTO schedules SET ?'
    connection.query(schedulesInsert, schedulesData, function (err, result) {
        if (err) throw err
        console.log('User schedule is inserted successfully ')
    })
    res.redirect('/schedules')
})

router.get('/logout', (req, res) => {
    res.cookie('jwtCookie', '', { maxAge: 1 })
    res.redirect('/login')
})

function verifyToken(req, res, next) {
    const token = req.cookies.jwtCookie
    console.log(req.cookies.jwtCookie)
    //console.log('this is the token', token)
    if (typeof token !== 'undefined') {
        //const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, 'secretkey')
        console.log(token)
        req.email = decoded.email
        console.log('decoded is', decoded)
        next()
    } else {
        return res.redirect('/login')
    }
}

module.exports = router
