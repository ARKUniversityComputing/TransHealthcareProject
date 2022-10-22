import express from 'express';
import {estimateCost, Medication} from './cost_estimation/estimator';
import path from 'path';
import bodyParser from 'body-parser'
import NodeGeocoder from 'node-geocoder';
import {exampleCal} from './calendar/calendar';


const geocoderOptions = {
    provider: 'google',
    apiKey: 'AIzaSyA0caYqmHfBYnEERq4GzumQSmFeU88YB6E'
  };
const geocoder = NodeGeocoder(geocoderOptions);
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/estimate', async (req, res) => {
    if (req.query.address) {
        const coords = await geocoder.geocode(req.query.address);

        res.send(estimateCost(coords[0].latitude, coords[0].longitude, Medication.ESTRADIOL_INJECTIONS));
    } else {
        res.render(`estimate`);
    }

});

const cal = exampleCal();

app.get('/calendar', (req, res) => {
    res.render(`calendar`, {cal: cal});
});

app.get('/calendar/download', (req, res) => {
    //res.send(`thank you for downolading "calendar"`)
    cal.toICal().serve(res);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

app.use(express.static(`static`));

console.log();
