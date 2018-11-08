const express = require('express')
const app = express()
const port = 8080;
var mysql = require('mysql');
var bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Qwert135!',
    database : 'node_mysql'
});


app.get('/', function(req, res){
    var q = 'SELECT COUNT(*) AS count from users;'
    connection.query(q, function (error, results, fields) {
    if (error) throw error;
    var numberOfUsersInDB = results[0].count;
    // res.send("We have "+ numberOfUsersInDB +" users in DB");
    res.render("home",{data:numberOfUsersInDB});
  });
});


app.post('/register', function(req, res) {
    var person = {email: req.body.email}
    connection.query('INSERT INTO users SET ?', person, function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        res.redirect('/');
    });
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))