import { Router } from 'express';
import { getChatById, getChats, generateResponse } from './chat/chat.controller';

const globalRouter = Router();

globalRouter.get('/chats', getChats);
globalRouter.get('/chats/:id', getChatById);
globalRouter.post('/generate', generateResponse);


export default globalRouter;
