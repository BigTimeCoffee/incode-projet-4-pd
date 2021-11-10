const express = require('express')
const router = express.Router()

router.get('/users', (req, res) => {
    connection.query('SELECT * FROM users', function (err, result) {
        if (err) throw err
        console.log(result)
        res.render('users', { layout: 'index', result })
    })
})

router.get('/users/new', (req, res) => {
    res.render('form', { layout: 'index' })
})

router.post('/users/new', (req, res) => {
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
    res.redirect('/users')
})

router.get(`/users/:id/schedules`, (req, res) => {
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

router.get('/users/:id', (req, res) => {
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

module.exports = router
