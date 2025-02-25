//const { Router } = require('express')     // importando Router de entro da biblioteca express
import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';

const routes = new Router();      // instanciando a classe Router

const upload = multer(multerConfig);

//configurando uma rota
routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);
routes.post('/products', upload.single('file'), ProductController.store);

//module.exports = routes
export default routes

