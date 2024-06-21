

import 'dotenv/config';
import express from 'express';
import globalRouter from './global-router';
import { logger } from './logger';
import WebSocket from 'ws';
import http from 'http';
import Chat from './chat/chat.models';
import model from './openai';
import cors from 'cors'
import connectDB from './db';

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(logger);
app.use(express.json());
app.use(cors());
app.use('/api/v1/', globalRouter);

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    ws.on('message', async message => {
        const userPrompt = JSON.parse(message.toString()).message;

        try {
            const result = await model.generateContentStream([userPrompt]);

            let fullResponse = '';
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                fullResponse += chunkText;
                ws.send(JSON.stringify({ response: chunkText }));
            }

            const chat = new Chat({ userPrompt, response: fullResponse });
            await chat.save();
        } catch (error) {
            console.error(error);
            ws.send(JSON.stringify({ error: 'Error connecting to Gemini API' }));
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server runs at http://localhost:${PORT}`);
});
