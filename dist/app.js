"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const estimator_1 = require("./cost_estimation/estimator");
const body_parser_1 = __importDefault(require("body-parser"));
const node_geocoder_1 = __importDefault(require("node-geocoder"));
const geocoderOptions = {
    provider: 'google',
    apiKey: 'AIzaSyA0caYqmHfBYnEERq4GzumQSmFeU88YB6E'
};
const geocoder = (0, node_geocoder_1.default)(geocoderOptions);
const app = (0, express_1.default)();
const port = 3000;
app.set('view engine', 'ejs');
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.get('/estimate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.address) {
        const coords = yield geocoder.geocode(req.query.address);
        res.send((0, estimator_1.estimateCost)(coords[0].latitude, coords[0].longitude, estimator_1.Medication.ESTRADIOL_INJECTIONS));
    }
    else {
        res.render(`estimate`);
    }
}));
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
app.use(express_1.default.static(`static`));
//# sourceMappingURL=app.js.map