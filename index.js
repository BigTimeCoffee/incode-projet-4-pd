const express = require('express')
const app = express()
const data = require('./data')
const crypto = require('crypto')
const port = 1000
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')

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
}) // render has 2 peramaters, 'main' which points to the handlebars file and an object with the layout property pointing to the index file

app.get('/users', (req, res) => {
    let usersData = data.users
    console.log(usersData)

    res.render('users', { layout: 'index', usersData })
})

app.get('/schedules', (req, res) => {
    let schedulesData = data.schedules
    console.log(schedulesData)
    res.render('schedules', { layout: 'index', schedulesData })
})

app.get(`/users/:userId/schedules`, (req, res) => {
    let schedulesData = data.schedules.filter((obj) => {
        return req.params.userId == obj.user_id
    })
    res.render('schedules', { layout: 'index', schedulesData })
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
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hash,
    }
    data.users.push(userDetails)
    res.redirect('/users/new')
})

app.get('/schedules/new', (req, res) => {
    let usersData = data.users
    console.log(usersData)
    for (i = 0; i < usersData.length; i++) {
        usersData[i].id = i
    }
    console.log('Users after for', usersData)
    res.render('scheduleForm', { layout: 'index', usersData })
})

app.post('/schedules/new', (req, res) => {
    const schedulesData = {
        user_id: req.body.user_id,
        day: req.body.day,
        start_at: req.body.start_at,
        end_at: req.body.end_at,
    }

    data.schedules.push(schedulesData)

    res.redirect('/schedules/new')
})

app.get('/users/:id', (req, res) => {
    let id = req.params.id
    if (data.users[id]) {
        let usersData = data.users[id]
        res.render('user', { layout: 'index', usersData })
    } else {
        res.json('Unknown')
    }
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
