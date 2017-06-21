'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

var AccesoSchema = new Schema ({
	  url:  String,
	  username: String,
	  password: String
	
})

module.exports = mongoose.model('Acceso', AccesoSchema)
		