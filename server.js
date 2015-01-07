var express = require('express')
var app = express()

app.set('view engine', 'jade')
app.locals.basedir = app.get('views')

app.get('/', function (req, res) {
  res.render('home')
})

var port = Number(process.env.PORT || 5000)
var server = app.listen(port, function (){
  console.log('GRU started on', port)
})
