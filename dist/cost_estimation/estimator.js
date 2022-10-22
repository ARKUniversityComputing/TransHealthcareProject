"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateCost = exports.Medication = void 0;
var Medication;
(function (Medication) {
    Medication["ESTRADIOL_INJECTIONS"] = "ESTRADIOL_INJECTIONS";
    Medication["PROGESTERONE_CAPSULES"] = "PROGESTERONE_CAPSULES";
    Medication["SPIRO"] = "SPIRO";
    Medication["TESTOSTERONE_INJECTIONS"] = "TESTOSTERONE_INJECTIONS"; // per mL
})(Medication = exports.Medication || (exports.Medication = {}));
// NEGATIVE PRICE MEANS IT DOESNT  HAVE IT 
const fs_1 = __importDefault(require("fs"));
function estimateCost(latitude, longitude, med) {
    let rawdata = fs_1.default.readFileSync('res/pharmacies.json');
    let pharmacies = JSON.parse(rawdata.toString());
    let costs = {};
    for (let pharmacyDataI in pharmacies) {
        let pharmacyData = pharmacies[pharmacyDataI];
        if (pharmacyData.prices[med] < 0) {
            continue;
        }
        let distance = calcCrow(latitude, longitude, pharmacyData.latitude, pharmacyData.longitude);
        let shippingCost = 0.001 * distance;
        let totalCost = pharmacyData.prices[med] + shippingCost;
        costs[pharmacyData.name] = totalCost;
    }
    let smallestCost = 1000000;
    let cheapestPharmacy = "";
    for (let pharmacyName in costs) {
        let cost = costs[pharmacyName];
        if (smallestCost > cost) {
            smallestCost = cost;
            cheapestPharmacy = pharmacyName;
        }
    }
    for (let pharmacyDataI in pharmacies) {
        let pharmacyData = pharmacies[pharmacyDataI];
        if (pharmacyData.name == cheapestPharmacy) {
            return { data: pharmacyData, cost: smallestCost.toFixed(2) };
        }
    }
}
exports.estimateCost = estimateCost;
function calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}
// Converts numeric degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180;
}
//# sourceMappingURL=estimator.js.map