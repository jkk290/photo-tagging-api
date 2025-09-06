const crypto = require('crypto');
const request = require('supertest');
const app = require('../src/server');
const mockPrisma = require('../__mocks__/mockPrisma');

jest.mock('../src/prisma', () => require('../__mocks__/mockPrisma'));

describe('POST /api/games', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should receive status 201 and game started true', async () => {
        const gameId = crypto.randomUUID();
        const testPayload = {
            gameId: gameId,
            gameStart: true
        }

        mockPrisma.game.create.mockResolvedValueOnce({
            gameId: gameId,
            gameStart: Date.now()
        });
        
        const response = await request(app)
            .post('/api/games')
            .send(testPayload);

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({
            started: true
        });
    });

    test('should receive status 201 with game record created info', async () => {
        const gameId = crypto.randomUUID();
        const endTime = Date.now();
        const testPayload = {
            gameId: gameId,
            gameStart: false,
            playerName: 'Bob',
            endTime: endTime
        }

        mockPrisma.game.findFirst.mockResolvedValueOnce({
            gameId: gameId,
            gameStart: Date.now() - (30 * 1000)
        });
        mockPrisma.game.delete.mockResolvedValueOnce();
        mockPrisma.record.create.mockResolvedValueOnce({ playerName: 'Bob', timer: 30 });

        const response = await request(app)
            .post('/api/games')
            .send(testPayload);

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({
            record: { playerName: 'Bob', timer: 30 },
            created: true
        });
    })
});