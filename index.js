const express = require('express')
const app = express()
const port = 3000
const handlebars = require('express-handlebars')

const indexRouter = require('./routes/index')
const schedulesRouter = require('./routes/schedules')
const usersRouter = require('./routes/users')

const password = process.env.PASSWORD
require('dotenv').config()

const mysql = require('mysql2')
const cookieParser = require('cookie-parser')
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
})

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

app.use(cookieParser())
app.use('/', indexRouter)
app.use('/schedules', schedulesRouter)
app.use('/users', usersRouter)

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

// const schedule = require('./models/scheduleModel.js')
// const user = require('./models/scheduleModel.js')
// const path = require('path')
// const bodyParser = require('body-parser')
// const session = require('express-session')
