var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

var port = Number(process.env.PORT || 5000)
var server = app.listen(port, function (){
  console.log('GRU started on', port)
})
