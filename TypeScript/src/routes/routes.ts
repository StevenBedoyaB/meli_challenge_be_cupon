import express, { Express } from 'express';

const app: Express = express();

app.use('/coupon', require('./coupon'));

module.exports = app;
