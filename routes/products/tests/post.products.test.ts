import request from 'supertest';
import express from 'express';
import ROUTES from '../../routes';
import { router } from '../products.router';
import { productsErrorMessages } from '../../schemas';
import { generateProductData } from './productsDataGenerator';

const app = express();
app.use(express.json());
app.use(router);
let productResponse: request.Response;

describe('POST /products - Validation', () => {
    afterEach(async () => {
        if (productResponse) {
            await request(app).delete(`${ROUTES.PRODUCTS}/${productResponse.body.id}`);
        }
    });
    test('should return 400 when title is empty string', async () => {
        productResponse = await request(app)
            .post(ROUTES.PRODUCTS)
            .send(generateProductData({
                title: '',
            }));
        expect(productResponse.statusCode).toBe(400);
        expect(productResponse.body).toHaveProperty('error', 'Validation failed');
        expect(productResponse.body.details[0].field).toBe('title');
        expect(productResponse.body.details[0].message).toBe(productsErrorMessages.EMPTY_TITLE);
    });

    test('should return 400 when title is undefined', async () => {
        productResponse = await request(app)
            .post(ROUTES.PRODUCTS)
            .send(generateProductData({
                title: undefined,
            }));

        expect(productResponse.statusCode).toBe(400);
        expect(productResponse.body).toHaveProperty('error', 'Validation failed');
        expect(productResponse.body.details[0].field).toBe('title');
        expect(productResponse.body.details[0].message).toBe(productsErrorMessages.UNDEFINED_TITLE);
    });

    test('should return 400 when price is negative', async () => {
        productResponse = await request(app)
            .post(ROUTES.PRODUCTS)
            .send(generateProductData({
                price: -10,
            }));

        expect(productResponse.statusCode).toBe(400);
        expect(productResponse.body).toHaveProperty('error', 'Validation failed');
        expect(productResponse.body.details).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: 'price',
                    message: productsErrorMessages.NEGATIVE_PRICE,
                })
            ])
        );
    });

    test('should return 400 when photo is not a valid URL', async () => {
        productResponse = await request(app)
            .post(ROUTES.PRODUCTS)
            .send(generateProductData({
                photo: 'not-a-url',
            }));

        expect(productResponse.statusCode).toBe(400);
        expect(productResponse.body).toHaveProperty('error', 'Validation failed');
        expect(productResponse.body.details).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: 'photo',
                    message: productsErrorMessages.INVALID_PHOTO_URL,
                })
            ])
        );
    });

    test('should return 201 when all fields are valid', async () => {
        const validProduct = generateProductData();
        productResponse = await request(app)
            .post(ROUTES.PRODUCTS)
            .send(validProduct);

        expect(productResponse.statusCode).toBe(201);
        expect(productResponse.body).toHaveProperty('id');
        expect(productResponse.body).toMatchObject(validProduct);
        expect(productResponse.body).toHaveProperty('isDeleted', 0);
    });
});
