const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 


app.post('/sse', (req, res) => {  
  const {msg} = req.body;
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  let times = 7;
  const interval = setInterval(() => {
    const data = { msg: msg + ' ' + times, state: times === 0 ? 'done' : 'pending' };
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    if (times === 0) {
      clearInterval(interval);
      res.end();
    }
    times--;
  }, 1000);
});
