import express, { Express } from 'express';
import { CouponController } from '../controllers/coupon';

const app: Express = express();

app.get('/', CouponController.selectItems);                 // app.post('/', CouponController.selectItems);
app.get('/most-req', CouponController.mostRequestedItems);  // app.get('/', CouponController.mostRequestedItems);

module.exports = app;