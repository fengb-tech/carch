var appRoot = require('app-root-path')

var server = require(appRoot + '/server')

var port = Number(process.env.PORT || 5000)
server.listen(port, function(){
  console.log('CARCH started on', port)
})
