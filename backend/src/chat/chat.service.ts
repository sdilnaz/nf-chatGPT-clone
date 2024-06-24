import WebSocket from 'ws';
import Chat from '../chat/chat.models';
import model from '../openai';

export const setupWebSocket = (server: any) => {
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
};
