"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const estimator_1 = require("./cost_estimation/estimator");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3000;
app.get('/estimate', (req, res) => {
    res.sendFile(path_1.default.join(__dirname + '/../res/estimate.html'));
});
app.post('/estimate_result', (req, res) => {
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    res.send((0, estimator_1.estimateCost)(40.448819, -79.953920, estimator_1.Medication.SPIRO));
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
app.use(express_1.default.static(`static`));
console.log();
//# sourceMappingURL=app.js.map