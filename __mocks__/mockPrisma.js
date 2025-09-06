const mockPrisma = {
    character: {
        findFirst: jest.fn()
    },
    record: {
        findMany: jest.fn(),
        create: jest.fn()
    },
    game: {
        create: jest.fn(),
        delete: jest.fn()
    }
};

module.exports = mockPrisma;