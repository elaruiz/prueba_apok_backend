'use strict'

var app = require('./app'),
	mongoose = require('mongoose')
	
mongoose.connect(process.env.MONGODB || 'mongodb://localhost:27017/prueba1', (err, res) => {
	if (err) {
		return console.log(`Error al conectar a la BD: ${err}`)
	}
	console.log('Conexion a la BD establecida')

	app.listen(app.get('port'), function () {
		console.log(`API REST corriendo en http://localhost:${app.get('port')}`)
	})
})