var server = require('cate/server')

var port = Number(process.env.PORT || 5000)
server.listen(port, function(){
  console.log('CATE started on', port)
})
