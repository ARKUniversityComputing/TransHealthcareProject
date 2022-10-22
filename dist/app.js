"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
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
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
app.use(express_1.default.static(`static`));
console.log();
//# sourceMappingURL=app.js.map
