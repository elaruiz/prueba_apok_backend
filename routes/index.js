'use strict'

var Cliente = require('../models/cliente.js'),
    Acceso = require('../models/acceso.js'),
    cors = require('cors'), //para permitir peticiones desde servidores externos a nuestra aplicación. 
    express = require('express'),
    router = express.Router()

  //GET - Devuelve todos los clientes de la BD
   function findAllClients(req, res) {
  	Cliente.find({}, function(err, clientes) {
        Acceso.populate(clientes, {path: "accesos"},function(err, clientes){
            res.status(200).send({clientes: clientes});
        }); 
    });
  }
 
  //GET - Devuelve un cliente con ID especifico
   function findById(req, res) {
   // let clienteId = req.body.id
    let d = JSON.parse(req.body.data)
    console.log(d.id)

    Cliente.findOne({"rif":d.id}, function(err, cliente) {
        Acceso.populate(cliente, {path: "accesos"},function(err, cliente){
            res.status(200).send({cliente: cliente});
        }); 
    });

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
    Cliente.update({_id:clienteId}, update, (err, clienteUpdated) => {
      if (err) return res.status(500).send({message: `Error al actualizar el acceso: ${err}`})
        res.status(200).send({message: `Cliente actualizado`})
    })
  }

 
  //DELETE - Elimina un cliente con ID especifico
  function deleteClient(req, res) {
    console.log("DELETE - /cliente/:id")
    return Cliente.findById(req.params.id, function(err, cliente) {
      if(!cliente) {
        res.status(404).send({message: `El cliente no existe`})
      }
 
      return cliente.remove(function(err) {
        if(!err) {
          res.status(200).send({ message: `Eliminado correctamente`})
        } else {
         res.status(500).send({message: `Error al actualizar el cliente: ${err}`})
        }
      })
    })
  }

  //Agregara un nuevo acceso

  function addAcceso(req, res) {
    let d = JSON.parse(req.body.data)
    console.log(d)
    var acceso = new Acceso({
      url: d.url, 
      password: d.pass,
      username: d.user
    });

    Cliente.findOne({"_id":req.params.id}, function(err, cliente) {
      acceso.save(function (err) {
        if (err) throw err;
        cliente.accesos.push(acceso._id);
        cliente.save(function (err, clienteStored) {
          if (err) throw err;
          res.status(200).send({msg: 'Ok'})
        })
      })
    })
  }


   //Actualiza un acceso
  
  function cambiaAcceso(req, res) {
    let id = req.params.idAcceso
    let update = JSON.parse(req.body.data)
    console.log(update)
    Acceso.update({_id:id}, update, (err, clienteUpdated) => {
      if (err) return res.status(500).send({message: `Error al actualizar el acceso: ${err}`})
        res.status(200).send({message: `Acceso actualizado`})
    })
  }


  //Elimina un acceso

  function deleteAcceso(req, res) {
    return Acceso.findById(req.params.idAcceso, function(err, acceso) {
      if(!acceso) {
        res.status(404).send({message: `El acceso no existe`})
      }
 
      return acceso.remove(function(err) {
        if(!err) {
          res.status(200).send({ message: `Eliminado correctamente`})
        } else {
         res.status(500).send({message: `Error al actualizar el acceso: ${err}`})
        }
      })
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
	router.put('/acceso/:id', cors(), addAcceso)
	router.put('/accesos/:idAcceso', cors(), cambiaAcceso)
  router.options('/cliente/:id', optionClient);
  router.options('/acceso/:id', optionClient);
  router.options('/acceso/:idAcceso', optionClient);
  router.options('/accesos/:idAcceso', optionClient);
	router.delete('/cliente/:id', cors(), deleteClient)
	router.delete('/acceso/:idAcceso', cors(), deleteAcceso)

 module.exports = router