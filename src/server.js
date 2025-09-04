require('dotenv').config();
const express = require('express');
const { PrismaClient, Prisma } = require('../generated/prisma');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get('/api', (req, res) => res.send('Hello, world!'));

app.post('/api/characters/verify', async (req, res) => {

    if ((Number.isNaN(parseInt(req.body.posX))) || (Number.isNaN(parseInt(req.body.posY)))) {
        return res.status(400).json({
            message: 'Invalid data sent'
        });
    };

    const minX = parseInt(req.body.posX) - 35;
    const maxX = parseInt(req.body.posX) + 35;
    const minY = parseInt(req.body.posY) - 35;
    const maxY = parseInt(req.body.posY) + 35;

    const result = await prisma.character.findFirst({
        where: {
            posX: {
                gte: minX,
                lte: maxX,
            },
            posY: {
                gte: minY,
                lte: maxY,
            },
        },
    });

    if (result.name === req.body.name) {
        res.status(200).json({
            message: 'Character found!',
            found: true,
        });
    } else {
        res.status(404).json({
            message: 'Character not found',
            found: false,
        });
    }
});

module.exports = app;