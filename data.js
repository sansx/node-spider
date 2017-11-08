var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'newtest',
});

connection.connect();

connection.query('select * from mewo', function(err, rows) {
  if (err) throw err;
  	console.log(rows);
    console.log("SELECT ==> ");
            for (var i in rows) {
                console.log(rows[i]);
            }
});

connection.end();

