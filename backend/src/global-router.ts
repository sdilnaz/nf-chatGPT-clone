import { Router } from 'express';
import { getChatById, getChats, generateResponse } from './chat/chat.controller';
//import { roadmapRouter } from './roadmap/roadmap.router';
// other routers can be imported here


const globalRouter = Router();

// Use the userRouter for user-related routes
//globalRouter.use(roadmapRouter);
globalRouter.get('/chats', getChats);
globalRouter.get('/chats/:id', getChatById);
globalRouter.post('/generate', generateResponse);


export default globalRouter;
