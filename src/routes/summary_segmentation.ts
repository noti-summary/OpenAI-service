import { Router, Request, Response } from 'express';
import { Configuration, OpenAIApi } from 'openai';
import { config } from '../config';


export const summarySegmentationRouter = Router();

const MODEL: string = "gpt-3.5-turbo";
const MAX_SEGMENT: number = 4000;

const configuration = new Configuration({
    apiKey: config.openaiApiKey,
});
const openai = new OpenAIApi(configuration);


summarySegmentationRouter.post('/', async (req: Request, res: Response): Promise<void> => {
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
      const segmentResult = completion.data.choices[0].message?.content as string;
      results.push(segmentResult);
    }

    let finalResult: string;
    if (results.length == 1) {
      finalResult = results.join(' ');
    } else {
      const completion = await openai.createChatCompletion({
        model: MODEL,
        messages: [
          { "role": "user", "content": results.join(' ') + "tl;dr"},
        ],
      });
      finalResult = completion.data.choices[0].message?.content as string
    }

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

summarySegmentationRouter.post('/key', async(req: Request, res: Response): Promise<void> => {
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
          const segmentResult = completion.data.choices[0].message?.content as string;
          results.push(segmentResult);
        }

        let finalResult: string;
        if (results.length == 1) {
          finalResult = results.join(' ');
        } else {
          const completion = await userOpenai.createChatCompletion({
            model: MODEL,
            messages: [
              { "role": "user", "content": results.join(' ') + "tl;dr"},
            ],
          });
          finalResult = completion.data.choices[0].message?.content as string
        }

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
      const newString = currentString + "\n" + line;
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
