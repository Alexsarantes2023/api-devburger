//const express = require('express')    //importando de express modo antigo
import express from 'express';  //nova forma de importar
// const routes = require('./routes')    //importando de routes modo antigo
import routes from './routes';  //nova forma de importar

//import './database';
import './database';


class App {
    constructor() {
        this.app = express();

        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.app.use(express.json());
    }

    routes() {
        this.app.use(routes);
    }
}

// module.exports = new App().app        //exportando modo antigo
export default new App().app;             //nova forma de exportar