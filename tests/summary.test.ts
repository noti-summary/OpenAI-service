import request from 'supertest';
import server from '../src/index';
import { config } from '../src/config';


afterAll(async () => {
    server.close();
});

describe("POST /openai/summary", () => {

    test('return a summary for a given prompt and content', async () => {
        const response = await request(server)
            .post('/openai/summary')
            .send({ prompt: "You are a helpful assistant.", content: "How are you?" });

        expect(response.status).toBe(200);
        expect(typeof response.body).toBe('string');
    });

    test('not provide prompt or content', async () => {
        const response = await request(server)
            .post('/openai/summary')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.error.message).toEqual(expect.stringContaining("content' is a required property"));
    });

});


describe("POST /openai/summary/key", () => {

    test('return a summary for a given prompt, content, and key', async () => {
        const response = await request(server)
            .post('/openai/summary/key')
            .send({ prompt: "You are a helpful assistant.", content: "How are you?", key: config.openaiApiKey });

        expect(response.status).toBe(200);
        expect(typeof response.body).toBe('string');
    });

    test('not provide prompt or content', async () => {
        const response = await request(server)
            .post('/openai/summary/key')
            .send({ key: config.openaiApiKey });

        expect(response.status).toBe(400);
        expect(response.body.error.message).toEqual(expect.stringContaining("content' is a required property"));
    });

    test('invalid api key', async () => {
        const response = await request(server)
          .post('/openai/summary/key')
          .send({ prompt: "You are a helpful assistant.", content: "How are you?", key: "invalid-key" });
    
        expect(response.status).toBe(401);
        expect(response.body.error.message).toEqual(expect.stringContaining("Incorrect API key provided"));
    });

});