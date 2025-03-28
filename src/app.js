//const express = require('express')    //importando de express modo antigo
import express from 'express';  //nova forma de importar
// const routes = require('./routes')    //importando de routes modo antigo
import routes from './routes';  //nova forma de importar
import cors from 'cors';

import { resolve } from 'node:path';

import './database';
//import './databse';


class App {
    constructor() {
        this.app = express();

        this.app.use(cors());
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.app.use(express.json());
        this.app.use('/product-file', express.static(resolve(__dirname, '..', 'uploads')),);
    

        this.app.use('/category-file', express.static(resolve(__dirname, '..', 'uploads')),);
    };

    routes() {
        this.app.use(routes);
    }
}

// module.exports = new App().app        //exportando modo antigo
export default new App().app;             //nova forma de exportar