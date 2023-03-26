import 'dotenv/config';

import express from 'express';
import morgan from 'morgan';

import middleware from 'chatgpt-as-a-backend/express';

const { OPENAI_API_KEY, PORT } = process.env;
const port = PORT || 3000;

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));

app.use('/', middleware({ apiKey: OPENAI_API_KEY }));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
