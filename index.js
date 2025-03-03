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
    if(times > 0){
      const data = { msg: msg + ' ' + times, status: 'complete' };
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }else if (times === 0) {
      clearInterval(interval);
      res.write(`data: [DONE]`);
      res.end();
    }
    times--;
  }, 1000);
});
