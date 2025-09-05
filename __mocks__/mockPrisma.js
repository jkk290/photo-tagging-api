const mockPrisma = {
    character: {
        findFirst: jest.fn()
    },
    record: {
        findMany: jest.fn(),
        create: jest.fn()
    }
};

module.exports = mockPrisma;