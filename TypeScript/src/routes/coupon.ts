import express, { Express } from 'express';
import { CouponController } from '../controllers/coupon';

const app: Express = express();

app.post('/', CouponController.selectItems);
app.put('/', CouponController.mostRequestedItems);

module.exports = app;