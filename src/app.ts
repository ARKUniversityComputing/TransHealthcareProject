import express from 'express';
import {estimateCost, Medication} from './cost_estimation/estimator';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

app.use(express.static(`static`));

console.log(estimateCost(40.448819, -79.953920, Medication.SPIRO));