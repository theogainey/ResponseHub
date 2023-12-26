const express = require('express');
const app = express();
const port = 8000;

app.get('/', (req, res) => {
  console.log('Received GET Request:');
  console.log(req.body);
  res.status(200).send('GET Request received successfully');
});

app.post('/', (req, res) => {
  console.log('Received POST Request:');
  console.log(req.body);
  res.status(200).send('POST Request received successfully');
});

app.put('/', (req, res) => {
  console.log('Received PUT Request:');
  console.log(req.body);
  res.status(200).send('PUT Request received successfully');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
