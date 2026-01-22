const { z } = require('zod');

const productsErrorMessages = {
    UNDEFINED_TITLE: 'Invalid input: expected string, received undefined',
    EMPTY_TITLE: 'Title is required',
    TITLE_TOO_LONG: 'Title must be less than 200 characters',
    EMPTY_DESCRIPTION: 'Description is required',
    NEGATIVE_PRICE: 'Price must be a positive number',
    EMPTY_PHOTO: 'Photo is required',
    INVALID_PHOTO_URL: 'Photo must be a valid URL'
};

const createProductSchema = z.object({
    title: z.string({ required_error: productsErrorMessages.EMPTY_TITLE })
        .min(1, productsErrorMessages.EMPTY_TITLE)
        .max(200, productsErrorMessages.TITLE_TOO_LONG),
    description: z.string({ required_error: productsErrorMessages.EMPTY_DESCRIPTION })
        .min(1, productsErrorMessages.EMPTY_DESCRIPTION),
    price: z.number({ required_error: productsErrorMessages.NEGATIVE_PRICE })
        .positive(productsErrorMessages.NEGATIVE_PRICE),
    photo: z.string({ required_error: productsErrorMessages.EMPTY_PHOTO })
        .url(productsErrorMessages.INVALID_PHOTO_URL)
});

// Schema for updating a product (same as create for now)
const updateProductSchema = createProductSchema;

module.exports = {
    productsErrorMessages,
    createProductSchema,
    updateProductSchema
};
