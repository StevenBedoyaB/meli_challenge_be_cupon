import dotenv from 'dotenv';
dotenv.config();
import express, { Express } from 'express';
import cors from 'cors';
import http from 'http';

const app: Express = express();
const port: string = process.env.PORT;

const db = require('./database/database');
db.sequelize.authenticate()
    .then(() => {
        console.log('Connected to SQLite3');
        db.sequelize.sync()
            .then(() => {
                console.log(`Database & tables created!`);
            });
    })
    .catch((err: any) => {
        console.log('SQLite3 connection error', err);
    });

function invalidPathHandler(request: express.Request, response: express.Response, next: express.NextFunction): void {
    console.log('IN', request.method)
    response.status(404).send({ msg: 'page not found' });
}

function middleware(request: express.Request, response: express.Response, next: express.NextFunction): void {
    console.log('MIDDLEWARE', request.method)
    next();
}

app.use(cors());
app.use(express.json());

// Global routes config
app.use('/api', middleware, require('./routes/routes'));
app.use(invalidPathHandler)

const httpServer: http.Server = app.listen(port, () => {
    console.log('HTTP REST API Server running at http://localhost:' + httpServer.address()['port']);
});