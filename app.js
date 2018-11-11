const express = require('express')
const app = express()
const port = 8080;
var redis = require('redis');
var mysql = require('mysql');
var bodyParser = require('body-parser');



app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var RedisClient = redis.createClient();
RedisClient.on('error', function(err){
    console.log(' RedisClient went wrong ', err)
});

var MySqlconnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Qwert135!',
    database : 'node_mysql'
});


app.get('/', function(req, res){
    var q = 'SELECT COUNT(*) AS count from users;'
    MySqlconnection.query(q, function (error, results, fields) {
    if (error) throw error;
    var numberOfUsersInDB = results[0].count;
    res.render("home",{data:numberOfUsersInDB});
  });
});


app.post('/deleteUser', function (req, res) {
    var email = req.body.deleteEmail;
    var q = `DELETE FROM users WHERE email="${email}"`
    MySqlconnection.query(q, function (error, results, fields) {
        if (error) throw error;
        console.log('deleted ' + results.affectedRows + ' rows');
        res.redirect('/');
    })

})

app.post('/register', function(req, res) {
    var person = {email: req.body.email}
    RedisClient.set('yinon', req.body.email);
    MySqlconnection.query('INSERT INTO users SET ?', person, function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        res.redirect('/');
    });
});


app.listen(port, () => console.log(`MySql app listening on port ${port}!`))