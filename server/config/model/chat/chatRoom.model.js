import { Schema, model } from 'mongoose';

const chatRoomSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        expertId: {
            type: Schema.Types.ObjectId,
            ref: 'Expert',
            required: true,
            index: true,
        },
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
        },
        lastMessage: {
            type: String,
            trim: true,
        },
        lastMessageAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Ensure only one chat room per booking
chatRoomSchema.index({ bookingId: 1 }, { unique: true });

// Performance indexes
chatRoomSchema.index({ userId: 1, expertId: 1 });
chatRoomSchema.index({ lastMessageAt: -1 });

const ChatRoom = model('ChatRoom', chatRoomSchema);

export default ChatRoom;
