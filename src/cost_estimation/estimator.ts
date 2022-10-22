export  enum Medication {
    ESTRADIOL_INJECTIONS = "ESTRADIOL_INJECTIONS", // per mL
    PROGESTERONE_CAPSULES = "PROGESTERONE_CAPSULES", // per pill
    SPIRO = "SPIRO", // per 50mg tablet
    TESTOSTERONE_INJECTIONS = "TESTOSTERONE_INJECTIONS" // per mL
}

// NEGATIVE PRICE MEANS IT DOESNT  HAVE IT 
import fs from 'fs';

export function estimateCost(latitude: number, longitude: number, med: Medication) {
    let rawdata = fs.readFileSync('res/pharmacies.json');
    let pharmacies: object = JSON.parse(rawdata.toString());

    let costs: {[key: string]: number} = {};

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

    let smallestCost:  number = 1000000;
    let cheapestPharmacy: String = "";
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
            return {data: pharmacyData, cost: smallestCost};
        }
    }
}

function calcCrow(lat1: number, lon1: number, lat2: number, lon2: number) 
    {
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
    }

    // Converts numeric degrees to radians
    function toRad(Value) 
    {
        return Value * Math.PI / 180;
    }