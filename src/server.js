require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./prisma');
const crypto = require('crypto');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'https://photo-tagging-production-e42e.up.railway.app'}));
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

    const targetBoxSize = 35;
    const minX = parseInt(req.body.posX) - targetBoxSize;
    const maxX = parseInt(req.body.posX) + targetBoxSize;
    const minY = parseInt(req.body.posY) - targetBoxSize;
    const maxY = parseInt(req.body.posY) + targetBoxSize;

    try {
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
    } catch (error) {
        res.status(500).json({
            error: error,
            message: 'Unable to verify character position'
        })
    };    

});

app.get('/api/records', async (req, res) => {
    try {
        const records = await prisma.record.findMany();

        if (records) {
            res.status(200).json(records);
        } else {
            res.status(404).json({
                message: 'No records found'
            })
        }
    } catch (error) {
        res.status(500).json({
            error: error,
            message: 'Unable to get records'
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

    try {
        const newRecord = await prisma.record.create({
            data: {
                playerName: req.body.playerName,
                timer: parseInt(req.body.timer)
            }
        });

        res.status(201).json(newRecord);
    } catch (error) {
        res.status(500).json({
            error: error,
            message: 'Unable to create new record'
        })
    };
    
})

app.post('/api/games/start', async (req, res) => {
    
        const startTime = Date.now();
        const gameId = crypto.randomUUID();

        try {
            const newGame = await prisma.game.create({
                data: {
                    gameId: gameId,
                    gameStart: startTime
                }
            })

            if (newGame) {
                return res.status(201).json({
                    gameId: gameId,
                    started: true
                });
            };
        } catch (error) {
            res.status(500).json({
                error: error,
                message: 'Unable to start game'
            })
        }
        
});

app.post('/api/games/end', async (req, res) => {
    try {
        const gameEnd = Date.now();
        
        const { gameStart } = await prisma.game.findFirst({
            where: {
                gameId: req.body.gameId
            },
            select: {
                gameStart: true
            }
        });

        const startTime = Number(gameStart);

        if (startTime) {
            try {
                await prisma.game.delete({
                    where: {
                        gameId: req.body.gameId
                    }
                });
            } catch (error) {
                console.log('Unable to clean up game session', error)
            }            
            const milliseconds = 1000;
            const latencyThreshold = 6;
            const backendTime = Math.floor((gameEnd - startTime) / milliseconds);
            const frontendTime = parseInt(req.body.endTime);
            let recordTime;

            if (backendTime - frontendTime <= latencyThreshold) {
                recordTime = backendTime;
            } else {
                recordTime = frontendTime;
            }

            try {
                const newRecord = await prisma.record.create({
                    data: {
                        playerName: req.body.playerName,
                        timer: recordTime
                    }
                });
                return res.status(201).json({
                    record: newRecord,
                    created: true
                });
            } catch (error) {
                return res.status(500).json({
                    error: error,
                    message: 'Unable to create new record'
                })
            }
            
        };
    } catch (error) {
        res.status(500).json({
            error: error,
            message: 'Unable to end game'
        })
    }; 
});

module.exports = app;