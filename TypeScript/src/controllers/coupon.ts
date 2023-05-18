import express from 'express';
import axios, { AxiosResponse } from 'axios';
import { Model } from 'sequelize';
const Favorites = require('../database/database').favorites;
export class CouponController {

    private constructor() {

    }

    public static async selectItems(request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> {
        console.log('POST - selectItems');
        if ( !('item_ids' in request.body) ) {
            response.status(400).send({ error: '"item_ids" missing' });
            return;
        }

        if ( !('amount' in request.body) ) {
            response.status(400).send({ error: '"amount" missing' });
            return;
        }

        const { item_ids, amount }: { item_ids: string[], amount: number } = request.body;

        if ( !Array.isArray(item_ids) ) {
            response.status(400).send({ error: '"item_ids" is not an Array' });
            return;
        }

        if ( !item_ids.length ) {
            response.status(400).send({ error: '"item_ids" is empty' });
            return;
        }

        if (typeof amount !== 'number' || Number.isNaN(amount)) {
            response.status(400).send({ error: '"amount" is not a Number' });
            return;
        }

        const meliItemIdFormat: RegExp = /^M[A-Z]{2}\d{8,10}$/;
        const itemIdsMalformed: string[] = item_ids.filter((itemId: string) => {
            return !meliItemIdFormat.test(itemId);
        })
        if (itemIdsMalformed.length) {
            response.status(400).send({ error: `item_ids malformed: ${itemIdsMalformed.join(', ')}` });
            return;
        }

        let axiosResponse: AxiosResponse;
        try {
            axiosResponse = await axios.get(
                `https://api.mercadolibre.com/items?ids=${item_ids.join(',')}&attributes=id,price`,
                {
                    timeout: 30000,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                },
            );
        } catch (e) {
            response.status(e.response.status).send({ error: `${e.code} - ${e.response.statusText}` });
            return;
        }

        const itemIdsNotFound: string[] = axiosResponse.data.filter((itemId: object) => {
            return itemId['code'] !== 200;
        }).map((itemIdNotFound: object) => {
            return itemIdNotFound['body'].id;
        });
        if (itemIdsNotFound.length) {
            response.status(400).send({ error: `item_ids not found: ${itemIdsNotFound.join(', ')}` });
            return;
        }

        const itemIdsAmount: object = {};
        axiosResponse.data.forEach((itemIdAmount: object) => {
            itemIdsAmount[itemIdAmount['body'].id] = itemIdAmount['body'].price;
        })

        // Ascending sort for item_ids related by amount
        item_ids.sort((a: string, b: string) => itemIdsAmount[a] - itemIdsAmount[b]);

        // Storing items frequency
        for (const itemId of item_ids) {
            Favorites.findOne({ where: { item_id: itemId } })
                .then((res: Model) => {
                    if (res) {
                        Favorites.increment('freq', { by: 1, where: { item_id: itemId } }).then((ures: Model) => {})
                            .catch((err) => {
                                console.log('Error updating item frequency', err)
                            });
                    }
                    else {
                        Favorites.create({ item_id: itemId, freq: 1 }).then((cres: Model) => {})
                            .catch((err) => {
                                console.log('Error creating item frequency', err)
                            });
                    }
                })
                .catch((err) => {
                    console.log('Error reading item frequency', err);
                });
        }

        const itemIdsSelected: string[] = [];
        let savedAmount: number = 0;

        for (let i: number = 0; i < item_ids.length; i++) {
            const item: string = item_ids[i];
            const price: number = itemIdsAmount[item];

            if (savedAmount + price <= amount) {
                itemIdsSelected.push(item);
                savedAmount += price;
            }
            else {
                break; // Break bucle if savedAmount exceed amount
            }
        }

        let totalAmount: number = 0;
        for (const itemIdSelected of itemIdsSelected) {
            totalAmount += itemIdsAmount[itemIdSelected];
        }

        response.status(200).send({ item_ids: itemIdsSelected, total: totalAmount });
    };

    public static async mostRequestedItems(request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> {
        console.log('GET - mostRequestedItems');
        Favorites.findAll({ order: [ ['freq', 'DESC'] ], limit: 5 })
            .then((favoritesRes: Model[]) => {
                const itemIdsFreq: object[] = [];
                for (const favorite of favoritesRes) {
                    itemIdsFreq.push({ [favorite.dataValues.item_id]: favorite.dataValues.freq });
                }

                response.status(200).send(itemIdsFreq);
            })
            .catch((err) => {
                console.log('Error reading all items', err);
                response.status(500).send({ error: 'Error reading all items' });
            });
    };

}