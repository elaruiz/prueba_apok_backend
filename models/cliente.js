'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
var Acceso = require('../models/acceso.js')

var ClienteSchema = new Schema ({
	nombre: String,
	rif: String,
	telefono: String,
	email: {type: String, unique: true, lowercase:true},
	direccion: String,
	contacto: String,
	accesos:  [{ type: Schema.ObjectId, ref: 'Acceso' }]
})

module.exports = mongoose.model('Cliente', ClienteSchema)
		