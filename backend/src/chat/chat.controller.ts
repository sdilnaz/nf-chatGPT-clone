import { Request, Response } from 'express';
import Chat from '../chat/chat.models'

import model from '../openai';


export const getChatById = async (req: Request, res: Response) => {
	try {
		const chat = await Chat.findById(req.params.id);
		if (!chat) {
			return res.status(404).json({ error: 'Chat not found' });
		}
		res.json(chat);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch chat' });
	}
};


export const getChats = async (req: Request, res: Response) => {
	try {
		const chats = await Chat.find().sort({ createdAt: -1 });
		res.json(chats);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch chats' });
	}
};


export const generateResponse = async (req: Request, res: Response) => {
    const userPrompt = req.body.message;

    try {
        const result = await model.generateContentStream([userPrompt]);

        let fullResponse = '';
        for await (const chunk of result.stream) {
            fullResponse += chunk.text();
        }

        const chat = new Chat({ userPrompt, response: fullResponse });
        await chat.save();

        res.json({ response: fullResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error connecting to LLM API' });
    }
};



