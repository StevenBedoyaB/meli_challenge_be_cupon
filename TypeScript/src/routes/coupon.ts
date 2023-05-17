import express, { Express } from 'express';
import { CouponController } from '../controllers/coupon';

const app: Express = express();

app.post('/', CouponController.selectItems);
app.get('/', CouponController.mostRequestedItems);

module.exports = app;