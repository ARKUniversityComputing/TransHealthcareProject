import express from 'express';
import {estimateCost, Medication} from './cost_estimation/estimator';
import path from 'path';
import bodyParser from 'body-parser'

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/estimate', (req, res) => {
    //console.log(req.query);
    if (req.query.latitude && req.query.longitude) {
        res.send(`test test`);
    } else {
        res.render(`estimate`);
        //res.sendFile(path.join(__dirname+'/../res/estimate.html'));
    }

});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

app.use(express.static(`static`));

console.log();