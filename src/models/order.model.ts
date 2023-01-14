import mongoose, { Schema, Document, Model } from 'mongoose';


export interface OrderDoc extends Document {
    orderId: string,
    vendorId: string,
    items: [any],
    totalAmount: number,
    OrderDate: Date,
    paidThrough: string,
    paymentResponse: string,
    orderStatus: string,
    remarks: string,
    deliveryId: string,
    appliedOffers : boolean,
    offerId : string,
    readyTime : number,
}


const orderSchema = new Schema({
    orderId: {
        type: String,
        required: true,
    },
    vendorId: {
        type: String,
        required: true,
    },
    items: [{
        food: {
            type: Schema.Types.ObjectId, ref: 'food', required: true
        },
        unit: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
    },
    OrderDate: {
        type: Date,
    },
    paidThrough: {
        type: String,
    },
    paymentResponse: {
        type: String
    },
    orderStatus: {
        type: String
    }

}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v,
                delete ret.createdAt,
                delete ret.updatedAt
        },
    },
    timestamps: true
});
const Order = mongoose.model<OrderDoc>('order', orderSchema);


export { Order }