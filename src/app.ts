import express from 'express';
import {estimateCost, Medication} from './cost_estimation/estimator';
import path from 'path';
import bodyParser from 'body-parser'
import NodeGeocoder from 'node-geocoder';
import {exampleCal, genCalendar} from './calendar/calendar';


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
    if (req.query.address && req.query.medication) {
        const coords = await geocoder.geocode(req.query.address);

        const pharmData = estimateCost(coords[0].latitude, coords[0].longitude, req.query.medication);

        res.render('pharmacy', {pharmData: pharmData});
    } else {
        res.render(`estimate`);
    }

});

app.get('/calendar', (req, res) => {
    if (req.query.startDate && req.query.hrtType) {
        const cal = genCalendar(req.query.startDate, req.query.hrtType);
        res.render(`calendar`, {cal: cal, startDate: req.query.startDate, hrtType: req.query.hrtType});
    } else {
        res.render(`calendargen`);
    }
});

app.get('/calendar/download', (req, res) => {
    if (req.query.startDate && req.query.hrtType) {
        const cal = genCalendar(req.query.startDate, req.query.hrtType);
        cal.toICal().serve(res);
    } else {
        res.send("no start date provided, can't generate calendar :(")
    }
});

app.get('/',  (req, res) => {
    res.render('home');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

app.use(express.static(`static`));

console.log();
