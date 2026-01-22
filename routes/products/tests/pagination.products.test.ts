import request from 'supertest';
import express from 'express';
import ROUTES from '../../routes';
import { router } from '../products.router';
import { generateProductData } from './productsDataGenerator';

const app = express();
app.use(express.json());
app.use(router);

describe('Product Pagination Tests', () => {
    let createdProducts: any[] = [];

    beforeAll(async () => {
        // Create 25 test products for pagination testing
        for (let i = 0; i < 25; i++) {
            const product = generateProductData();
            const response = await request(app).post(ROUTES.PRODUCTS).send(product);
            createdProducts.push(response.body);
        }
    });

    afterAll(async () => {
        // Clean up all created products
        for (const product of createdProducts) {
            await request(app).delete(`${ROUTES.PRODUCTS}/${product.id}`);
        }
        createdProducts = [];
    });

    test('should return pagination metadata', async () => {
        const response = await request(app).get(`${ROUTES.PRODUCTS}?page=1&limit=10`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('products');
        expect(response.body).toHaveProperty('pagination');
        expect(response.body.pagination).toHaveProperty('page');
        expect(response.body.pagination).toHaveProperty('limit');
        expect(response.body.pagination).toHaveProperty('total');
        expect(response.body.pagination).toHaveProperty('totalPages');
        expect(response.body.pagination).toHaveProperty('order');
    });

    test('should return correct number of products per page', async () => {
        const limit = 10;
        const response = await request(app).get(`${ROUTES.PRODUCTS}?page=1&limit=${limit}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.products.length).toBeLessThanOrEqual(limit);
        expect(response.body.pagination.limit).toBe(limit);
    });

    test('should return correct page number', async () => {
        const page = 2;
        const response = await request(app).get(`${ROUTES.PRODUCTS}?page=${page}&limit=10`);

        expect(response.statusCode).toBe(200);
        expect(response.body.pagination.page).toBe(page);
    });

    test('should calculate total pages correctly', async () => {
        const limit = 10;
        const response = await request(app).get(`${ROUTES.PRODUCTS}?page=1&limit=${limit}`);
        const expectedTotalPages = Math.ceil(response.body.pagination.total / limit);

        expect(response.statusCode).toBe(200);
        expect(response.body.pagination.totalPages).toBe(expectedTotalPages);
    });

    test('should return different products on different pages', async () => {
        const page1Response = await request(app).get(`${ROUTES.PRODUCTS}?page=1&limit=10`);
        const page2Response = await request(app).get(`${ROUTES.PRODUCTS}?page=2&limit=10`);

        expect(page1Response.statusCode).toBe(200);
        expect(page2Response.statusCode).toBe(200);
        
        const page1Ids = page1Response.body.products.map((p: any) => p.id);
        const page2Ids = page2Response.body.products.map((p: any) => p.id);
        
        // Check that pages have different products (no overlap)
        const overlap = page1Ids.filter((id: number) => page2Ids.includes(id));
        expect(overlap.length).toBe(0);
    });

    test('should default to page 1 and limit 12 if not specified', async () => {
        const response = await request(app).get(ROUTES.PRODUCTS);

        expect(response.statusCode).toBe(200);
        expect(response.body.pagination.page).toBe(1);
        expect(response.body.pagination.limit).toBe(12);
    });

    test('should handle invalid page numbers gracefully', async () => {
        const response = await request(app).get(`${ROUTES.PRODUCTS}?page=0&limit=10`);

        expect(response.statusCode).toBe(200);
        expect(response.body.pagination.page).toBe(1); // Should default to 1
    });

    test('should return empty products array for page beyond total pages', async () => {
        const response = await request(app).get(`${ROUTES.PRODUCTS}?page=9999&limit=10`);

        expect(response.statusCode).toBe(200);
        expect(response.body.products.length).toBe(0);
    });

    test('should sort products in ascending order by default', async () => {
        const response = await request(app).get(`${ROUTES.PRODUCTS}?page=1&limit=10`);

        expect(response.statusCode).toBe(200);
        expect(response.body.pagination.order).toBe('ASC');
        
        const products = response.body.products;
        for (let i = 0; i < products.length - 1; i++) {
            expect(products[i].id).toBeLessThanOrEqual(products[i + 1].id);
        }
    });

    test('should sort products in descending order when specified', async () => {
        const response = await request(app).get(`${ROUTES.PRODUCTS}?page=1&limit=10&order=desc`);

        expect(response.statusCode).toBe(200);
        expect(response.body.pagination.order).toBe('DESC');
        
        const products = response.body.products;
        for (let i = 0; i < products.length - 1; i++) {
            expect(products[i].id).toBeGreaterThanOrEqual(products[i + 1].id);
        }
    });

    test('should handle ascending order parameter (case insensitive)', async () => {
        const response = await request(app).get(`${ROUTES.PRODUCTS}?page=1&limit=10&order=ASC`);

        expect(response.statusCode).toBe(200);
        expect(response.body.pagination.order).toBe('ASC');
    });

    test('should maintain sort order across pages', async () => {
        const page1Response = await request(app).get(`${ROUTES.PRODUCTS}?page=1&limit=5&order=desc`);
        const page2Response = await request(app).get(`${ROUTES.PRODUCTS}?page=2&limit=5&order=desc`);

        expect(page1Response.statusCode).toBe(200);
        expect(page2Response.statusCode).toBe(200);
        
        const lastIdPage1 = page1Response.body.products[page1Response.body.products.length - 1].id;
        const firstIdPage2 = page2Response.body.products[0].id;
        
        // In descending order, last ID of page 1 should be greater than first ID of page 2
        expect(lastIdPage1).toBeGreaterThan(firstIdPage2);
    });

    test('should handle custom limit values', async () => {
        const customLimit = 5;
        const response = await request(app).get(`${ROUTES.PRODUCTS}?page=1&limit=${customLimit}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.products.length).toBeLessThanOrEqual(customLimit);
        expect(response.body.pagination.limit).toBe(customLimit);
    });
});
