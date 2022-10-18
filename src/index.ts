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
  const excuseCache = await client.get(`excuse-No${req.params.number}`);
  if(excuseCache) return res.json(JSON.parse(excuseCache));

  console.log('Getting data from API');
  const excuse = await axios.get('https://excuser.herokuapp.com/v1/excuse/id/'+req.params.number);
  client.set(`excuse-No${req.params.number}`, JSON.stringify(excuse.data));
  return res.json(excuse.data);
});

app.get('/get-product/:id', async (req, res) => {
  const productCache = await client.get(`product-No${req.params.id}`);
  if(productCache) return res.json(JSON.parse(productCache));

  console.log('Getting data from Fake-Api');
  const product = await axios.get('http://localhost:3067/products/'+req.params.id);
  client.set(`product-No${req.params.id}`, JSON.stringify(product.data));
  return res.json(product.data);
});


app.listen(port, () => {
  console.log(`Server running in port ${port} my friend!`);
})