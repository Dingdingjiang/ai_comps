const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

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

  if(msg.trim() === 'md'){
    const filePath = path.join(__dirname, 'expChat.md');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Error reading file');
        return;
      }
      
      const lines = data.split('\n');
      const partSize = Math.ceil(lines.length / 7);
      const parts = [];
      for (let i = 0; i < lines.length; i += partSize) {
        parts.push(lines.slice(i, i + partSize).join('\n'));
      }

      let timeLen = Math.ceil(7000 / parts.length);
      let index = 0;
      const interval = setInterval(() => {
        if (index < parts.length) {
          res.write(`data: ${JSON.stringify({ msg: parts[index], status: 'complete' })}\n\n`);
          index++;
        } else {
          clearInterval(interval);
          res.write('data: [DONE]\n\n');
          res.end();
        }
      }, timeLen);
    });
  } else {
    let times = 7;
    const interval = setInterval(() => {
      if(times > 0){
        const data = { msg: msg + ' ' + times, status: 'complete' };
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      } else if (times === 0) {
        clearInterval(interval);
        res.write(`data: [DONE]`);
        res.end();
      }
      times--;
    }, 1000);
  }

});

app.post('/readmd', (req, res) => {
  const filePath = path.join(__dirname, 'expChat.md');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading file');
      return;
    }

    const lines = data.split('\n');
    const partSize = Math.ceil(lines.length / 7);
    const parts = [];
    for (let i = 0; i < lines.length; i += partSize) {
      parts.push(lines.slice(i, i + partSize).join('\n'));
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let index = 0;
    const interval = setInterval(() => {
      if (index < parts.length) {
        res.write(`data: ${JSON.stringify({ part: parts[index], status: 'complete' })}\n\n`);
        index++;
      } else {
        clearInterval(interval);
        res.write('data: [DONE]\n\n');
        res.end();
      }
    }, 428); // 3000ms / 7 parts = ~428ms per part
  });
});
