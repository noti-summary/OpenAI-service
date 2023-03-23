import request from 'supertest';
import server from "../src/index";


afterAll(async () => {
    server.close();
});

describe("POST /openai/summary", () => {

    test('return a summary for a given prompt and content', async () => {
        const response = await request(server)
            .post('/openai/summary')
            .send({ prompt: "You are a helpful assistant.", content: "How are you?"});

        expect(response.status).toBe(200);
        expect(typeof response.body).toBe('string');
    });

});
