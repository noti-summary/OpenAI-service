import { Router, Request, Response } from 'express';
import { Configuration, OpenAIApi } from 'openai';

export const summaryRouter = Router();

summaryRouter.post('/', async(req: Request, res: Response): Promise<void> => {
    
    res.status(200).send("ok");
});