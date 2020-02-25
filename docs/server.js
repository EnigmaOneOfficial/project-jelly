const readdir = require('fs').readdir
const express = require('express')
const path = require('path')
const app = express()
var port = process.env.PORT || 1234;

app.use(express.static(path.join(__dirname + '/public')))

app.get('/', (req, res) => {
  console.log(req.method)
})

app.listen(port, () => {
  console.log('App listening on ' + port)
})
