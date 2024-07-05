const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

// La tua chiave segreta
const secret = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';

app.post('/webhook-endpoint', (req, res) => {
  const payload = JSON.stringify(req.body);
  const sigHeader = req.get('x-wc-webhook-signature');
  const sigHash = crypto.createHmac('sha256', secret).update(payload).digest('base64');

  console.log('Payload received:', req.body);
  console.log('Signature header:', sigHeader);
  console.log('Signature hash:', sigHash);

  if (sigHeader !== sigHash) {
    console.error('Signature mismatch');
    return res.status(400).send('Signature mismatch');
  }

  console.log('Webhook received and verified:', req.body);

  res.status(200).send('Webhook received');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
