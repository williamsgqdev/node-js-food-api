import mongoose from "mongoose";
import { MONGO_URI } from "../config";


export default async () => {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(MONGO_URI);
        console.log('Db Connected ❤️‍🔥');
    } catch (err) {
        console.error(err);
    }
}
