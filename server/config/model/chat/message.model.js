import { Schema, model } from 'mongoose';

const messageSchema = new Schema(
    {
        chatRoomId: {
            type: Schema.Types.ObjectId,
            ref: 'ChatRoom',
            required: true,
            index: true,
        },
        senderId: {
            type: Schema.Types.ObjectId,
            required: true,
            index: true,
        },
        senderRole: {
            type: String,
            enum: ['user', 'expert'],
            required: true,
        },
        messageType: {
            type: String,
            enum: ['text'],
            default: 'text',
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Indexes for efficient querying
messageSchema.index({ chatRoomId: 1 });
messageSchema.index({ chatRoomId: 1, createdAt: 1 });

const Message = model('Message', messageSchema);

export default Message;
