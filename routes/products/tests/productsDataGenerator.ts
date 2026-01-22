import { faker } from "@faker-js/faker/.";

export const generateProductData = (override = {} ) => ({
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.number.float({ min: 1, max: 1000, fractionDigits: 2 }),
    photo: faker.internet.url(),
    ...override,
});