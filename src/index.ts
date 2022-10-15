import express, { response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { createClient } from 'redis';
dotenv.config();

const app = express();
const port = process.env.PORT;

const client = createClient();
client.connect();

app.get('/health', (req, res) => {
  const healt = {status: 'ok'};
  res.json(healt);
});

app.get('/get/excuse/:number', async (req, res) => {
  const excuse = await client.get(`excuse-No${req.params.number}`);
  if(excuse) return res.json(JSON.parse(excuse));

  console.log('Getting data from API');
  const excuses = await axios.get('https://excuser.herokuapp.com/v1/excuse/id/'+req.params.number);
  client.set(`excuse-No${req.params.number}`, JSON.stringify(excuses.data));
  return res.json(excuses.data);
});


app.listen(port, () => {
  console.log(`Server running in port ${port} my friend!`);
})