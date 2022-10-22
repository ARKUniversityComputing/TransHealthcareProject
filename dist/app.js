"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const calendar_1 = require("./calendar/calendar");
const app = (0, express_1.default)();
const port = 3000;
app.set('view engine', 'ejs');
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.get('/estimate', (req, res) => {
    //console.log(req.query);
    if (req.query.latitude && req.query.longitude) {
        res.send(`test test`);
    }
    else {
        res.render(`estimate`);
        //res.sendFile(path.join(__dirname+'/../res/estimate.html'));
    }
});
const cal = (0, calendar_1.exampleCal)();
app.get('/calendar', (req, res) => {
    res.render(`calendar`, { cal: cal });
});
app.get('/calendar/download', (req, res) => {
    //res.send(`thank you for downolading "calendar"`)
    cal.toICal().serve(res);
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
app.use(express_1.default.static(`static`));
console.log();
//# sourceMappingURL=app.js.map