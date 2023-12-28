const express = require('express');
const app = express();
const port = 8000;

// must come before app.get()
app.head('/', (req, res) => {
  console.log('Received HEAD Request:');
  res.status(200).send('THIS SHOULD BE IGNORED IF YOU ARE SEEING THIS IN A RESPONSE SOMETHING IS WRONGxs');
});

app.get('/basic-auth', (req, res) => {
  console.log('Received GET Request With Basic Auth:');
  if(req.headers.authorization === `Basic ${btoa('username:password')}`){
    res.status(200).send('Success:  \nIf request was sent including username: username + password: password Basic Auth is working correctly');
    return;
  }
  console.log(`Received ${req.headers.authorization}`);
  console.log(`Expected Basic ${btoa('username:password')}`)
  res.status(403).send('Access Forbidden: \nIf request was sent including username: username + password: password Basic Auth is not working correctly');
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

app.options('/', (req, res) => {
  console.log('Received OPTIONS Request:');
  res.status(200).send('OPTIONS Request received successfully');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
