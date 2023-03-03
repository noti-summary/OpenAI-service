import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { summaryRouter } from './routes/summary';

dotenv.config();

const app = express();

app.set("port", process.env.PORT || 5000);
app.use(express.json());
app.use("/api/summary", summaryRouter);

const server = app.listen(app.get("port"), () => {
    console.log(`Server is running on port ${app.get("port")}`);
});

export default server;