import { Router, Request, Response } from 'express';
import { Configuration, OpenAIApi } from 'openai';
import { config } from '../config';


export const summaryRouter = Router();

const MODEL: string = "gpt-3.5-turbo"
const MAX_SEGMENT: number = 3000

const configuration = new Configuration({
    apiKey: config.openaiApiKey,
});
const openai = new OpenAIApi(configuration);


summaryRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const prompt: string = req.body.prompt;
    const content: string = req.body.content;

    const segmentedContent: string[] = segmentContent(content, MAX_SEGMENT);
    const results: string[] = [];

    for (const segment of segmentedContent) {
      const completion = await openai.createChatCompletion({
        model: MODEL,
        messages: [
          { "role": "system", "content": prompt },
          { "role": "user", "content": segment },
        ],
      });
      results.push(completion.data.choices[0].message?.content);
    }

    const finalResult: string = results.join(''); // Concatenate the results

    res.status(200).json(finalResult);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
      console.error(`${error.response.status}: ${JSON.stringify(error.response.data)}`);
    } else {
      res.status(500).json(error.message);
      console.error(`500: ${JSON.stringify(error.response.data)}`);
    }
  }
});

summaryRouter.post('/key', async(req: Request, res: Response): Promise<void> => {
    try{
        const prompt: string = req.body.prompt;
        const content: string = req.body.content;
        const key: string = req.body.key;

        const userConfiguration = new Configuration({
            apiKey: key,
        });
        const userOpenai = new OpenAIApi(userConfiguration);

        const segmentedContent: string[] = segmentContent(content, MAX_SEGMENT);
        const results: string[] = [];

        for (const segment of segmentedContent) {
          const completion = await userOpenai.createChatCompletion({
            model: MODEL,
            messages: [
              { "role": "system", "content": prompt },
              { "role": "user", "content": segment },
            ],
          });
          results.push(completion.data.choices[0].message?.content);
        }

        const finalResult: string = results.join(''); // Concatenate the results

        res.status(200).json(finalResult);
      } catch (error: any) {
        if (error.response) {
          res.status(error.response.status).json(error.response.data);
          console.error(`${error.response.status}: ${JSON.stringify(error.response.data)}`);
        } else {
          res.status(500).json(error.message);
          console.error(`500: ${JSON.stringify(error.response.data)}`);
        }
      }
});

function segmentContent(content: string, size: number): string[] {
    const lines: string[] = content.split(/\r?\n/);
    const result: string[] = [];
    
    let currentString: string = "";
    for (const line of lines) {
      const newString = currentString + line;
      if (newString.length <= size) {
        currentString = newString;
      } else {
        result.push(currentString);
        currentString = line;
      }
    }

    if (currentString.length > 0) {
      result.push(currentString);
    }
    return result;
}
