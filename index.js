const express = require('express');
const app = express();
const data = require('./data');
const crypto = require('crypto');
const port = 1000;
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');

app.set('view engine', 'hbs');
app.engine(
    'hbs',
    handlebars({
        layoutsDir: `${__dirname}/views/layouts`, // layoutsDir is a property that points to the necessary folder/files
        extname: 'hbs', // changes the extension name from 'handlebars' to 'hbs'
    })
);
app.use(express.static('public')); //points to the public folder where index.html is stored

app.post('/users', (req, res) => {
    let hash = crypto
        .createHash('sha256')
        .update(req.body.password)
        .digest('base64');
    let newUser = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hash,
    };
    data.users.push(newUser);
    res.send(newUser);
});

app.get('/', (req, res) => {
    res.render('main', { layout: 'index' });
}); // render has 2 peramaters, 'main' which points to the handlebars file and an object with the layout property pointing to the index file

app.get('/users', (req, res) => {
    let usersData = data.users;
    console.log(usersData);
    res.render('users', { layout: 'index' });
});

app.get('/schedules', (req, res) => {
    res.render('schedules', { layout: 'index' });
});

app.get('/users/:id', (req, res) => {
    let id = req.params.id;
    if (data.users[id]) {
        let userData = data.users[id];
        res.render('users', { layout: 'index', name });
    } else {
        res.json('Unknown');
    }
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

//app.use(bodyParser.json());

/*app.get('/', (req, res) => {
    res.send('Welcome to our schedule website');
});*/

/*app.get('/users', (req, res) => {
    res.send(data.users);
});*/

/*app.get('/schedules', (req, res) => {
    res.send(data.schedules);
});*/

/*app.get('/users/:id', (req, res) => {
    let id = req.params.id;
    if (data.users[id]) {
        res.json(data.users[id]);
    } else {
        res.json('Unknown');
    }
});*/

/*app.get(`/users/:userId/schedules`, (req, res) => {
    let newSchedules = data.schedules.filter((obj) => {
        return req.params.userId == obj.user_id;
    });
    console.log(newSchedules);
    res.send(newSchedules);
});*/
