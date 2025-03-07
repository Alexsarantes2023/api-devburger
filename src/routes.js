//const { Router } = require('express')     // importando Router de entro da biblioteca express
import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';
import CategoryController from './app/controllers/CategoryController';
import OrderController from './app/controllers/OrderController';

const routes = new Router();      // instanciando a classe Router

const upload = multer(multerConfig);

//configurando uma rota
routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware);
routes.post('/products', upload.single('file'), ProductController.store);
routes.get('/products', ProductController.index);

routes.post('/categories', CategoryController.store);
routes.get('/categories', CategoryController.index);

routes.post('/orders', OrderController.store); //criando pedido
routes.get('/orders', OrderController.index); //listando pedido
routes.put('/orders/:id', OrderController.update); //alterando status na orders

//module.exports = routes
export default routes

