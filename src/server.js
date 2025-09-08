require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./prisma');

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));
app.get('/api', (req, res) => res.send('Hello, world!'));

app.get('/api/characters', async (req, res) => {
    const characters = await prisma.character.findMany();
    if (!characters) {
        return res.status(404).json({message: 'No characters found'});
    }

    return res.status(200).json(characters);
})

app.post('/api/characters/verify', async (req, res) => {

    if ((req.body.name === undefined) || (req.body.name === '') || (req.body.posX === undefined) || (req.body.posY === undefined)) {
        return res.status(400).json({
            message: 'Missing name, posX, and/or posY'
        });
    };

    if ((Number.isNaN(parseInt(req.body.posX))) || (Number.isNaN(parseInt(req.body.posY))) || typeof req.body.name !== 'string') {
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

app.get('/api/records', async (req, res) => {
    const records = await prisma.record.findMany();

    if (records) {
        res.status(200).json(records);
    } else {
        res.status(404).json({
            message: 'No records found'
        })
    }
});

app.post('/api/records', async (req, res) => {
    if (req.body.playerName === undefined || req.body.playerName === '' || req.body.timer === undefined) {
        return res.status(400).json({
            message: 'Missing name and/or timer'
        });
    };
    
    if (typeof req.body.playerName !== 'string' || (Number.isNaN(parseInt(req.body.timer)))) {
        return res.status(400).json({
            message: 'Name must be a string and timer must be an int'
        });
    };

    const newRecord = await prisma.record.create({
        data: {
            playerName: req.body.playerName,
            timer: parseInt(req.body.timer)
        }
    });

    res.status(201).json(newRecord);
})

app.post('/api/games', async (req, res) => {
    if (req.body.gameStart) {
        const startTime = Date.now();
        const newGame = await prisma.game.create({
            data: {
                gameId: req.body.gameId,
                gameStart: startTime
            }
        })

        if (newGame) {
            return res.status(201).json({
                started: true
            });
        };
    } else if (req.body.endTime && !req.body.gameStart) {
        const startTime = await prisma.game.findFirst({
            where: {
                gameId: req.body.gameId
            },
            select: {
                gameStart: true
            }
        });

        if (startTime) {
            await prisma.game.delete({
                where: {
                    gameId: req.body.gameId
                }
            });

            const recordTime = parseInt(req.body.endTime) - startTime;

            const record = {
                playerName: req.body.playerName,
                timer: recordTime
            };

            const newRecord = await prisma.record.create(record);

            return res.status(201).json({
                record: newRecord,
                created: true
            });
        };
    } else {
        return res.status(500);
    }
});

module.exports = app;