import dotenv from 'dotenv'
import express from 'express'
import { GoogleGenAI } from '@google/genai'
import connectToDB from './app/db/db.js';
import chatRouter from './app/routes/chat.routes.js';

dotenv.config();

const app = express();
app.use(express.json());

const ai = new GoogleGenAI(process.env.GOOGLE_API_KEY);

app.use('/', chatRouter);

const port = process.env.PORT || 3000;

connectToDB().then(() => {
    app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})
})
