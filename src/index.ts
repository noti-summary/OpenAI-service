import express from 'express';
import cors from 'cors';
import morgan from "morgan";
import { config } from './config';
import { summaryRouter } from './routes/summary';
import { summarySegmentationRouter } from './routes/summary_segmentation';
import { gpt4Router } from './routes/gpt4';

const app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cors());
app.use(morgan('common')); 
app.use("/openai/summary", summaryRouter);
app.use("/openai/summary_segmentation", summarySegmentationRouter);
app.use("/openai/gpt4", gpt4Router);

const server = app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});

export default server;
