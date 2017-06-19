'use strict'

var Cliente = require('../models/cliente.js'),
    cors = require('cors'), //para permitir peticiones desde servidores externos a nuestra aplicación. 
    express = require('express'),
    router = express.Router()

  //GET - Devuelve todos los clientes de la BD
   function findAllClients(req, res) {
    console.log("GET - /clientes")
  	Cliente.find({}, function(err, Clientes) {
        res.status(200).send({clientes: Clientes})
    })
  }
 
  //GET - Devuelve un cliente con ID especifico
   function findById(req, res) {
    let clienteId = req.body.id
    let d = JSON.parse(req.body.data)
    console.log(d.id)
    // Json.decode()

	Cliente.findOne({"rif":d.id}, (err, cliente) => {
		if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
		if (!cliente) return res.status(404).send({message: `El cliente no existe`})

		res.status(200).send({cliente: cliente})
	})
  }
 
  //POST - Inserta un nuevo cliente a la BD
   function addClient(req, res) {
    let d = JSON.parse(req.body.data)
    console.log(d)
	  let cliente = new Cliente()

  	cliente.nombre = d.nombre
  	cliente.rif = d.rif
  	cliente.telefono = d.telefono
  	cliente.email = d.email
  	cliente.direccion = d.direccion
  	cliente.contacto = d.contacto

  	cliente.save((err, clienteStored) => {
  		if (err) res.status(500).send({message: `Error al salvar en la BD: ${err}`})

  		res.status(200).send({cliente: clienteStored})
  	})
  }

 
  //PUT - Actualiza un cliente existente
  function updateClient(req, res) {
    let clienteId = req.params.id
	let update = JSON.parse(req.body.data)
    console.log(update)

	Cliente.findByIdAndUpdate(clienteId, update, (err, clienteUpdated) => {
		if (err) return res.status(500).send({message: `Error al actualizar el cliente: ${err}`})

		res.status(200).send({ cliente: clienteUpdated })
	})
  }
 
  //DELETE - Elimina un cliente con ID especifico
  function deleteClient(req, res) {
    console.log("DELETE - /cliente/:id")
    return Cliente.findById(req.params.id, function(err, cliente) {
      if(!cliente) {
        res.statusCode = 404
        return res.send({ error: 'Not found' })
      }
 
      return cliente.remove(function(err) {
        if(!err) {
          console.log('Removed cliente')
          return res.send({ status: 'OK' })
        } else {
          res.statusCode = 500
          console.log('Internal error(%d): %s',res.statusCode,err.message)
          return res.send({ error: 'Server error' })
        }
      })
    })
  }

  //Agregara un nuevo acceso

  function crearAcceso(req, res){
    let clienteId = req.params.id
    let update = JSON.parse(req.body.data)
    let acceso = {url:  update.url, username: update.user, password: update.pass}
    
    Cliente.update(
      { _id: clienteId}, 
      { $push: { accesos: acceso } },
      (err) => {
		if (err) res.status(500).send({message: `Error al salvar en la BD: ${err}`})

		res.status(200).send({message: `Guardado`})
	})
    
  }
  //Actualiza un acceso
  
  function updateAcceso(req,res) {
    console.log(req.body)
    let edit = JSON.parse(req.body.data)
    Cliente.update({"_id": req.params.id, "accesos._id": req.params.idAcceso}, 
    {$set: {"accesos.$.url": edit.url,"accesos.$.username": edit.user,"accesos.$.password": edit.pass}},
      (err) => {
    if (err) res.status(500).send({message: `Error al salvar en la BD: ${err}`})

    res.status(200).send({message: `Acceso actualizado`})
  })
  }
  //Elimina un acceso
  function eliminarAcceso(req, res) {
    Cliente.update(
    {"_id": req.params.id},
    { $pull: { "accesos" : { _id: req.params.idAcceso } } },
    (err) => {
		if (err) res.status(500).send({message: `Error al salvar en la BD: ${err}`})

		res.status(200).send({message: `Acceso eliminado`})
	})
  }
  //Permite las operaciones PUT y DELETE
  function optionClient (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');

    next();
  }


	router.get('/', (req, res, next) => {
		res.status(200).send({message: 'Bienvenido'})
	})
	router.get('/clientes', cors(), findAllClients)
	router.post('/clienteid', cors(), findById)
	router.post('/cliente', cors(), addClient)
	router.put('/cliente/:id', cors(), updateClient)
	router.put('/acceso/:id', cors(), crearAcceso)
	router.put('/acceso/:id/:idAcceso', cors(), updateAcceso)
  	router.options('/cliente/:id', optionClient);
  	router.options('/acceso/:id', optionClient);
  	router.options('/acceso/:id/:idAcceso', optionClient);
	router.delete('/cliente/:id', cors(), deleteClient)
	router.delete('/acceso/:id/:idAcceso', cors(), eliminarAcceso)

 module.exports = router