'use strict'

var express = require('express'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	routes = require('./routes/index'),
	port = (process.env.PORT || 3000),
	methodOverride = require('method-override'),
	app = express()

app
	.set('port', port)
	// parse application/json
	.use( bodyParser.json() )
	// parse application/x-www-form-urlencoded
	.use( bodyParser.urlencoded({extended: false}) )
	.use( morgan('dev') )
	.use(methodOverride('X-HTTP-Method-Override'))
	.use(routes) 
	// HTTP headers config
//
    .use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Allow', 'POST, GET, PUT, DELETE, OPTIONS');

    next();
});

module.exports = app