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

function ping(request: express.Request, response: express.Response, next: express.NextFunction): void {
    response.status(200).send({ msg: 'it is alive' });
}

function invalidPathHandler(request: express.Request, response: express.Response, next: express.NextFunction): void {
    response.status(404).send({ error: 'page not found' });
}

app.use(cors());
app.use(express.json());

// Global routes config
app.get('/', ping);
app.use('/api', require('./routes/routes'));
app.use(invalidPathHandler);

const httpServer: http.Server = app.listen(port, () => {
    console.log('HTTP REST API Server running at http://localhost:' + httpServer.address()['port']);
});