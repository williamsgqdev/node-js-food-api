import express from 'express';
import { PORT } from './config';
import dbConnect from './services/DatabaseConnection';
import ExpressApp from './services/ExpressApp';



const StartServer = async () => {
    const app = express();
    await dbConnect();
    await ExpressApp(app);

    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT} 🚀`);
    })

}

StartServer();