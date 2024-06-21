import mongoose, { Document, Schema } from 'mongoose';

export interface Chat extends Document {
	userPrompt: string;
	response: string;
	createdAt: Date;
}

const chatSchema = new Schema<Chat>({
	userPrompt: { type: String, required: true },
	response: { type: String, required: true },
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Chat = mongoose.model<Chat>('Chat', chatSchema);

export default Chat;