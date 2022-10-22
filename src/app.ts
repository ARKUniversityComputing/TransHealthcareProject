import express from 'express';
import {estimateCost, Medication} from './cost_estimation/estimator';
import path from 'path';

const app = express();
const port = 3000;

app.get('/estimate', (req, res) => {
    res.sendFile(path.join(__dirname+'/../res/estimate.html'));
});

app.post('/estimate_result', (req, res) => {
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;

    

    res.send(estimateCost(40.448819, -79.953920, Medication.SPIRO));
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

app.use(express.static(`static`));

console.log();