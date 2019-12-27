var express = require('express')
var app = express()
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended:false}))

var mainRouter = require('./route/main.js')

app.use(mainRouter)
app.use(express.static(__dirname+'/public'));

app.listen(9000)
