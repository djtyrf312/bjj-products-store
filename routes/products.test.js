const request = require('supertest');
const express = require('express');
const { router, productsUrl } = require('./products');


const app = express();
app.use(express.json());
app.use(router);

describe('/products router', () => {
    it('get /products should return 200 status code', async () => {
        const response = await request(app).get(productsUrl)
        expect(response.statusCode).toBe(200);
    });

    it('get /products should return an array', async () => {
        const response = await request(app).get(productsUrl)
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('get /products should return valid properties', async () => {
        const response = await request(app).get(productsUrl)
        const firstProduct = response.body[0];
        expect(firstProduct).toBeDefined();
        expect(firstProduct).toHaveProperty('id');
        expect(firstProduct).toHaveProperty('title');
        expect(firstProduct).toHaveProperty('description');
        expect(firstProduct).toHaveProperty('price');
        expect(firstProduct).toHaveProperty('photo');
        expect(firstProduct).toHaveProperty('isDeleted');
    });
});



