const request = require('supertest');
const app = require('../src/server');

describe('POST /api/characters/verify', () => {
    test('should return 200 OK and "found" status if character is found', async () => {
        const testPayload = {
            name: 'Waldo',
            posX: 445,
            posY: 248
        };

        const response = await request(app)
            .post('/api/characters/verify')
            .send(testPayload);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            message: 'Character found!',
            found: true
        });
    });

    test('should return 404 and "not found" status if character is not found', async () => {
        const testPayload = {
            name: 'Waldo',
            posX: 200,
            posY: 248
        };

        const response = await request(app)
            .post('/api/characters/verify')
            .send(testPayload);

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
            message: 'Character not found',
            found: false
        });
    });

    test('should return 400 and data requirements message when invalid data sent', async () => {
        const testPayload = {
            name: 'Waldo',
            posX: 'abc',
            posY: 248
        };

        const response = await request(app)
            .post('/api/characters/verify')
            .send(testPayload);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: 'Name must be string and posX & posY must be int'
        });
    });

    test('should return 400 and missing data message when missing data sent', async () => {
        const testPayload = {
            name: undefined,
            posX: 293,
            posY: '',
        };

        const response = await request(app)
            .post('/api/characters/verify')
            .send(testPayload);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: 'Missing name, posX, and/or posY'
        });
    });
});