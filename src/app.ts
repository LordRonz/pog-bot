import express from 'express';

const app = express();

app.disable('etag');
app.disable('x-powered-by');

app.get('/', (_req, res) => res.send('Hello World!'));

export default app;
