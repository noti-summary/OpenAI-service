import express from 'express';
import { config } from './config';
import { summaryRouter } from './routes/summary';

const app = express();

app.set("port", config.port);
app.use(express.json());
app.use("/api/summary", summaryRouter);

const server = app.listen(app.get("port"), () => {
    console.log(`Server is running on port ${app.get("port")}`);
});

export default server;