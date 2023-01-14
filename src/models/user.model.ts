import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { OrderDoc } from './order.model';


export interface UserDoc extends Document {
    email: string;
    password: string;
    salt: string;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    verified: boolean;
    otp: number;
    otp_expiry: Date;
    lat: number;
    lng: number;
    orders: [OrderDoc],
    cart: [any];
}


const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false,
        required: true
    },
    otp: {
        type: Number,
        required: true
    },
    otp_expiry: {
        type: Date, required: true
    },
    lat: {
        type: Number,

    },
    lng: {
        type: Number,

    },
    orders: [
        {
            type: Schema.Types.ObjectId, ref: 'order'
        }
    ],
    cart: [
        {
            food: { type: Schema.Types.ObjectId, ref: 'food' },
            unit: { type: Number }
        }
    ]

}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password,
                delete ret.salt,
                delete ret.__v,
                delete ret.createdAt,
                delete ret.updatedAt
        },
    },
    timestamps: true
});


const User = mongoose.model<UserDoc>('user', UserSchema);

export { User }