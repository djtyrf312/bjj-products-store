import request from 'supertest';
import express from 'express';
import ROUTES from '../../routes';
import { router } from '../products.router';
import { generateProductData } from './productsDataGenerator';

const app = express();
app.use(express.json());
app.use(router);
let productResponse: request.Response;

beforeEach(async () => {
    const product = generateProductData();
    productResponse = await request(app).post(ROUTES.PRODUCTS).send(product);
});

afterEach(async () => {
    if (productResponse) {
        await request(app).delete(`${ROUTES.PRODUCTS}/${productResponse.body.id}`);
    }
});

test('test get products should return 200 and an array of products', async () => {
    const response = await request(app).get(ROUTES.PRODUCTS);
    const addedProduct = response.body.find((p: any) => p.title === productResponse.body.title);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(addedProduct).toBeDefined();
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('title');
    expect(response.body[0]).toHaveProperty('description');
    expect(response.body[0]).toHaveProperty('price');
    expect(response.body[0]).toHaveProperty('photo');
    expect(response.body[0]).toHaveProperty('isDeleted');
});
