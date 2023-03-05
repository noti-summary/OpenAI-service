import express from 'express';
import cors from 'cors';
import morgan from "morgan";
import { config } from './config';
import { summaryRouter } from './routes/summary';

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('common')); 
app.use("/openai/summary", summaryRouter);

const server = app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});

export default server;