const express = require('express');
const app = express();
const port = 8000;

// must come before app.get()
app.head('/', (req, res) => {
  console.log('Received HEAD Request:');
  res.status(200).send('THIS SHOULD BE IGNORED IF YOU ARE SEEING THIS IN A RESPONSE SOMETHING IS WRONGxs');
});


app.get('/', (req, res) => {
  console.log('Received GET Request:');
  res.status(200).send('GET Request received successfully');
});

app.post('/', (req, res) => {
  console.log('Received POST Request:');
  console.log(req.body);
  res.status(200).send('POST Request received successfully');
});

app.patch('/', (req, res) => {
  console.log('Received PATCH Request:');
  console.log(req.body);
  res.status(200).send('PATCH Request received successfully');
});

app.put('/', (req, res) => {
  console.log('Received PUT Request:');
  console.log(req.body);
  res.status(200).send('PUT Request received successfully');
});

app.delete('/', (req, res) => {
  console.log('Received DELETE Request:');
  console.log(req.body);
  res.status(200).send('DELETE Request received successfully');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
