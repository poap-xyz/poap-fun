import express from 'express';
import path from 'path';

const app = express();

const port = 80;

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req: express.Request, res: any) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
