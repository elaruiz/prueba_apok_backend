'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

var ClienteSchema = new Schema ({
	nombre: String,
	rif: String,
	telefono: String,
	email: {type: String, unique: true, lowercase:true},
	direccion: String,
	contacto: String,
	accesos: [{
	  url:  String,
	  username: String,
	  password: String
	}]
})

module.exports = mongoose.model('Cliente', ClienteSchema)
		