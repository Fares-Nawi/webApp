const express = require("express");
const hbs = require('express-hbs');
const app = express();
const port = 3000;
const path = require('path');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  database : 'news'
});

connection.connect();

app.engine('hbs', hbs.express4());

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const sql = "SELECT * FROM actualites ORDER BY date DESC";

  connection.query(sql, function (error, results, fields) {
      if (error) {
          console.error("Error executing query:", error);
          res.status(500).send("Internal Server Error");
          return;
      }

      hbs.registerHelper('formatDate', function (date) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(date).toLocaleString(undefined, options);
    });


      res.render('index', { news: results });
  });
});

app.get("/add", (req, res) => {
  res.render('add');
}); 

app.get("/addnews", function(req, res) {
    var untitre = req.query.letitre;
    var unedesc = req.query.ladescription;
    var sql = "insert into actualites(titre, description) values('" + untitre + "', '" + unedesc + "')"
    
    connection.query(sql, [untitre, unedesc], function(error, results, fields) {
      if (error) {
        console.error("Error adding news:", error);
        res.status(500).send("Error adding news");
    } else {
        res.redirect('/');
         }
    })
   
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
