const request = require('supertest');
const app = require('../src/server');
const mockPrisma = require('../__mocks__/mockPrisma');

jest.mock('../src/prisma', () => require('../__mocks__/mockPrisma'));

describe('GET /api/records', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should receive object with name and timer', async () => {
        mockPrisma.record.findMany.mockResolvedValueOnce({ name: 'Jay', timer: 32 });

        const response = await request(app)
            .get('/api/records');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            name: 'Jay',
            timer: 32
        });
    });
});

describe('POST /api/records', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should receive status code 201 and object record data', async () => {
        const testPayload = {
            playerName: 'Bob',
            timer: 84
        };

        mockPrisma.record.create.mockResolvedValueOnce({ playerName: 'Bob', timer: 84 });

        const response = await request(app)
            .post('/api/records')
            .send(testPayload);
        
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({
            playerName: 'Bob',
            timer: 84
        });
    });

    test('should receive status code 400 and data requirements message when invalid data sent', async () => {
        const testPayload = {
            playerName: 123,
            timer: 'abc'
        };

        const response = await request(app)
            .post('/api/records')
            .send(testPayload);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: 'Name must be a string and timer must be an int'
        });
    });

    test('should receive status code 400 and missing data message when missing data sent', async () => {
        const testPayload = {
            playerName: '',
            timer: undefined
        };

        const response = await request(app)
            .post('/api/records')
            .send(testPayload);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: 'Missing name and/or timer'
        });
    });
});