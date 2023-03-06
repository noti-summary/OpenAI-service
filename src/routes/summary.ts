import { Router, Request, Response } from 'express';
import { Configuration, OpenAIApi } from 'openai';
import { config } from '../config';

export const summaryRouter = Router();

const configuration = new Configuration({
    apiKey: config.openaiApiKey,
});

const openai = new OpenAIApi(configuration);

summaryRouter.post('/', async(req: Request, res: Response): Promise<void> => {
    try{
        const prompt: string = req.body.prompt;
        const content: string = req.body.content;

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo-0301",
            messages: [
                {"role": "system", "content": prompt},
                {"role": "user", "content": content},
            ],
        });
        res.status(200).json(completion.data.choices[0].message?.content);

    }catch(error: any){
        if(error.response){
            res.status(error.response.status).json(error.response.data);
        }else{
            res.status(500).json(error.message);
        }
    }
});