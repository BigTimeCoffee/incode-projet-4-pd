const express = require('express')
const router = express.Router()

require('dotenv').config() // process.env.var to access the variable.
const password = process.env.PASSWORD
const mysql = require('mysql2')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: password,
    database: 'incode_project_3',
    port: 3306,
})

router.get('/schedules', (req, res) => {
    connection.query('SELECT * FROM schedules', function (err, result) {
        if (err) throw err
        console.log(result)
        res.render('schedules', { layout: 'index', result })
    })
})
// render has 2 peramaters, 'main' which points to the handlebars file and an object with the layout property pointing to the index file

router.get('/schedules/new', (req, res) => {
    connection.query('SELECT first_name, id FROM users', (err, userData) => {
        if (err) throw err
        console.log('User schedule is inserted successfully ')
        res.render('scheduleForm', { layout: 'index', userData })
        //console.log(userData)
    })
})

router.post('/schedules/new', (req, res) => {
    const schedulesData = {
        user_id: req.body.user_id,
        day: req.body.day,
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

module.exports = router
