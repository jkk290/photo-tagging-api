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
});

describe('POST /api/characters/verify', () => {
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
});

describe('POST /api/characters/verify', () => {
    test('should return 400 bad request when invalid data sent', async () => {
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
            message: 'Invalid data sent'
        });
    });
});