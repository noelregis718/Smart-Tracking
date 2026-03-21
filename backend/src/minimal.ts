import express from 'express';
const app = express();
const PORT = 5000;
app.get('/', (req, res) => res.send('Minimal server is running!'));
app.listen(PORT, () => {
  console.log(`Minimal server is running on port ${PORT}`);
});
setInterval(() => {}, 1000000);
