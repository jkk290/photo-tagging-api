require('dotenv').config();
const express = require('express');
const prisma = require('./prisma');

const app = express();

app.use(express.json());

app.get('/api', (req, res) => res.send('Hello, world!'));

app.post('/api/characters/verify', async (req, res) => {

    if ((req.body.name === undefined) || (req.body.name === '') || (req.body.posX === undefined) || (req.body.posY === undefined)) {
        return res.status(400).json({
            message: 'Missing name, posX, and/or posY'
        });
    };

    if ((Number.isNaN(parseInt(req.body.posX))) || (Number.isNaN(parseInt(req.body.posY)))) {
        return res.status(400).json({
            message: 'Name must be string and posX & posY must be int'
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

    if (result && result.name === req.body.name) {
        res.status(200).json({
            message: 'Character found!',
            found: true,
        });
    } else {
        return res.status(404).json({
            message: 'Character not found',
            found: false,
        });
    };

});

module.exports = app;