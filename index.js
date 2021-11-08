const express = require('express')
const app = express()
const port = 3000
//const data = require('./data')
const crypto = require('crypto')
const handlebars = require('express-handlebars')
const bodyparser = require('body-parser')

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

connection.connect(function (err) {
    if (err) {
        throw err
    } else {
        console.log('Connected')
    }
}) // This function checks if we are connected to our database.

app.set('view engine', 'hbs')
app.engine(
    'hbs',
    handlebars({
        layoutsDir: `${__dirname}/views/layouts`, // layoutsDir is a property that points to the necessary folder/files
        extname: 'hbs', // changes the extension name from 'handlebars' to 'hbs'
    })
)
app.use(express.static('public')) //points to the public folder where index.html is stored
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.render('main', { layout: 'index' })
})

app.get('/schedules', (req, res) => {
    connection.query('SELECT * FROM schedules', function (err, result) {
        if (err) throw err
        console.log(result)
        res.render('schedules', { layout: 'index', result })
    })
})
// render has 2 peramaters, 'main' which points to the handlebars file and an object with the layout property pointing to the index file

app.get('/users', (req, res) => {
    connection.query('SELECT * FROM users', function (err, result) {
        if (err) throw err
        console.log(result)
        res.render('users', { layout: 'index', result })
    })
})

app.get(`/users/:id/schedules`, (req, res) => {
    connection.query(
        'SELECT * FROM schedules WHERE id = ?',
        [req.params.id],
        (err, result) => {
            if (err) throw err
            console.log(result)
            res.render('schedulesId', { layout: 'index', result })
        }
    )
})

app.get('/users/new', (req, res) => {
    res.render('form', { layout: 'index' })
})

app.post('/users/new', (req, res) => {
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

app.get('/schedules/new', (req, res) => {
    connection.query('SELECT first_name, id FROM users', (err, userData) => {
        if (err) throw err
        console.log('User schedule is inserted successfully ')
        res.render('scheduleForm',  { layout: 'index', userData })
        //console.log(userData)
})
    })
    

app.post('/schedules/new', (req, res) => {
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
    res.redirect('/')
})

app.get('/users/:id', (req, res) => {
    connection.query(
        'SELECT * FROM users WHERE id = ?',
        [req.params.id],
        (err, result) => {
            if (err) throw err
            console.log(result)
            res.render('user', { layout: 'index', result })
        }
    )
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
