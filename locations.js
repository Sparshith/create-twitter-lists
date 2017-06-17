var config = require('./config'),
googleMaps = require('@google/maps'),
fs = require('fs'),
parse = require('csv-parse'),
async = require('async'),
list = require('./list'),
csvWriter = require('csv-write-stream');

var inputFile = 'user_locations.csv';
var asyncTasks = [], examplesDir = 'examples/locations/';

var countryContinentMapping = {
  "AD": "Europe",
  "AE": "Middle East",
  "AF": "Middle East",
  "AG": "North America",
  "AI": "North America",
  "AL": "Europe",
  "AM": "Asia",
  "AN": "North America",
  "AO": "Africa",
  "AQ": "Antarctica",
  "AR": "South America",
  "AS": "Australia",
  "AT": "Europe",
  "AU": "Australia",
  "AW": "North America",
  "AZ": "Asia",
  "BA": "Europe",
  "BB": "North America",
  "BD": "Asia",
  "BE": "Europe",
  "BF": "Africa",
  "BG": "Europe",
  "BH": "Middle East",
  "BI": "Africa",
  "BJ": "Africa",
  "BM": "North America",
  "BN": "Asia",
  "BO": "South America",
  "BR": "South America",
  "BS": "North America",
  "BT": "Asia",
  "BW": "Africa",
  "BY": "Europe",
  "BZ": "North America",
  "CA": "North America",
  "CC": "Asia",
  "CD": "Africa",
  "CF": "Africa",
  "CG": "Africa",
  "CH": "Europe",
  "CI": "Africa",
  "CK": "Australia",
  "CL": "South America",
  "CM": "Africa",
  "CN": "Asia",
  "CO": "South America",
  "CR": "North America",
  "CU": "North America",
  "CV": "Africa",
  "CX": "Asia",
  "CY": "Middle East",
  "CZ": "Europe",
  "DE": "Europe",
  "DJ": "Africa",
  "DK": "Europe",
  "DM": "North America",
  "DO": "North America",
  "DZ": "Africa",
  "EC": "South America",
  "EE": "Europe",
  "EG": "Middle East",
  "EH": "Africa",
  "ER": "Africa",
  "ES": "Europe",
  "ET": "Africa",
  "FI": "Europe",
  "FJ": "Australia",
  "FK": "South America",
  "FM": "Australia",
  "FO": "Europe",
  "FR": "Europe",
  "GA": "Africa",
  "GB": "Europe",
  "GD": "North America",
  "GE": "Asia",
  "GF": "South America",
  "GG": "Europe",
  "GH": "Africa",
  "GI": "Europe",
  "GL": "North America",
  "GM": "Africa",
  "GN": "Africa",
  "GP": "North America",
  "GQ": "Africa",
  "GR": "Europe",
  "GS": "Antarctica",
  "GT": "North America",
  "GU": "Australia",
  "GW": "Africa",
  "GY": "South America",
  "HK": "Asia",
  "HN": "North America",
  "HR": "Europe",
  "HT": "North America",
  "HU": "Europe",
  "ID": "Asia",
  "IE": "Europe",
  "IL": "Middle East",
  "IM": "Europe",
  "IN": "Asia",
  "IO": "Asia",
  "IQ": "Middle East",
  "IR": "Middle East",
  "IS": "Europe",
  "IT": "Europe",
  "JE": "Europe",
  "JM": "North America",
  "JO": "Asia",
  "JP": "Asia",
  "KE": "Africa",
  "KG": "Asia",
  "KH": "Asia",
  "KI": "Australia",
  "KM": "Africa",
  "KN": "North America",
  "KP": "Asia",
  "KR": "Asia",
  "KW": "Middle East",
  "KY": "North America",
  "KZ": "Asia",
  "LA": "Asia",
  "LB": "Middle East",
  "LC": "North America",
  "LI": "Europe",
  "LK": "Asia",
  "LR": "Africa",
  "LS": "Africa",
  "LT": "Europe",
  "LU": "Europe",
  "LV": "Europe",
  "LY": "Africa",
  "MA": "Africa",
  "MC": "Europe",
  "MD": "Europe",
  "ME": "Europe",
  "MG": "Africa",
  "MH": "Australia",
  "MK": "Europe",
  "ML": "Africa",
  "MM": "Asia",
  "MN": "Asia",
  "MO": "Asia",
  "MP": "Australia",
  "MQ": "North America",
  "MR": "Africa",
  "MS": "North America",
  "MT": "Europe",
  "MU": "Africa",
  "MV": "Asia",
  "MW": "Africa",
  "MX": "North America",
  "MY": "Asia",
  "MZ": "Africa",
  "NA": "Africa",
  "NC": "Australia",
  "NE": "Africa",
  "NF": "Australia",
  "NG": "Africa",
  "NI": "North America",
  "NL": "Europe",
  "NO": "Europe",
  "NP": "Asia",
  "NR": "Australia",
  "NU": "Australia",
  "NZ": "Australia",
  "OM": "Middle East",
  "PA": "North America",
  "PE": "South America",
  "PF": "Australia",
  "PG": "Australia",
  "PH": "Asia",
  "PK": "Asia",
  "PL": "Europe",
  "PM": "North America",
  "PN": "Australia",
  "PR": "North America",
  "PS": "Middle East",
  "PT": "Europe",
  "PW": "Australia",
  "PY": "South America",
  "QA": "Middle East",
  "RE": "Africa",
  "RO": "Europe",
  "RS": "Europe",
  "RU": "Europe",
  "RW": "Africa",
  "SA": "Middle East",
  "SB": "Australia",
  "SC": "Africa",
  "SD": "Africa",
  "SE": "Europe",
  "SG": "Asia",
  "SH": "Africa",
  "SI": "Europe",
  "SJ": "Europe",
  "SK": "Europe",
  "SL": "Africa",
  "SM": "Europe",
  "SN": "Africa",
  "SO": "Africa",
  "SR": "South America",
  "ST": "Africa",
  "SV": "North America",
  "SY": "Middle East",
  "SZ": "Africa",
  "TC": "North America",
  "TD": "Africa",
  "TF": "Antarctica",
  "TG": "Africa",
  "TH": "Asia",
  "TJ": "Asia",
  "TK": "Australia",
  "TM": "Asia",
  "TN": "Africa",
  "TO": "Australia",
  "TR": "Middle East",
  "TT": "North America",
  "TV": "Australia",
  "TW": "Asia",
  "TZ": "Africa",
  "UA": "Europe",
  "UG": "Africa",
  "US": "North America",
  "UY": "South America",
  "UZ": "Asia",
  "VC": "North America",
  "VE": "South America",
  "VG": "North America",
  "VI": "North America",
  "VN": "Asia",
  "VU": "Australia",
  "WF": "Australia",
  "WS": "Australia",
  "YE": "Middle East",
  "YT": "Africa",
  "ZA": "Africa",
  "ZM": "Africa",
  "ZW": "Africa"
};

var parser = parse({delimiter: ','}, function (err, users) {
  var asyncTasks = [], listsObj = {}, noLocationUsers = [], validAddressUsers = [], allUsers = [];
  var googleMapsClient = googleMaps.createClient(config.auth.google);
  var noLocationWriter = csvWriter({ sendHeaders: false});
  noLocationWriter.pipe(fs.createWriteStream(examplesDir + 'noLocation.csv'));

  users.forEach(function(user, i) {
    var handle = user[0] || null;
    var location = user[1] || null;

    if(!handle) {
      return;
    }

    allUsers.push(handle);

    if(!location) {
      noLocationUsers.push(handle);
      noLocationWriter.write({ users: 'https://twitter.com/' + handle });
      return;
    }

    asyncTasks.push(function(callback){
      if((i !== 0) && (i % 50 == 0)) {
        console.log("Finished fetching data for "+ i + " users...");
      }

      googleMapsClient.geocode({
        address: location
      }, function(err, response) {
        if (err) {
          return callback&&callback(err);
        } else {
          if(response.json.results[0]) {
            var addressComponents = response.json.results[0].address_components || null;
            if(addressComponents) {
              for(var i in addressComponents) {
                var component = addressComponents[i];
                if(component.types.indexOf('country') >= -1) {
                  if(countryContinentMapping[component['short_name']] !== undefined && countryContinentMapping[component['short_name']]) {
                    var continent = countryContinentMapping[component['short_name']];
                    if(listsObj[continent] === undefined || !listsObj[continent]) {
                      listsObj[continent] = [];
                    }
                    validAddressUsers.push(handle);
                    listsObj[continent].push(handle);
                    return callback&&callback();
                  }
                }
              }
              /**
              * If no components match, return.
              **/
              return callback&&callback();
            } else {
              return callback&&callback();
            }
          } else {
            return callback&&callback();
          }
        }
      });
    })
  });

  noLocationWriter.end();

  if(asyncTasks.length > 2500) {
    console.log("Max limit per day is 2500, please reduce the number of users and try again!");
    return;
  }

  console.log("----------------Pretending to be fancy, hold on tight ------------------");

  async.series(asyncTasks, function(err){
    if(err) {
      console.log(err);
      return;
    }

    var invalidAddressUsers = allUsers.filter(x => noLocationUsers.indexOf(x) < 0 ).filter(x => validAddressUsers.indexOf(x) < 0 );
    var invalidAddressWriter = csvWriter({ sendHeaders: false});
    invalidAddressWriter.pipe(fs.createWriteStream(examplesDir + 'invalidAddress.csv'));

    console.log("Logging users with no locations or invalid addresses....");
    invalidAddressUsers.forEach(function(invalidAddressUser){
       invalidAddressWriter.write({ user: 'https://twitter.com/' + invalidAddressUser });
    });
    invalidAddressWriter.end();

    console.log("Logging users with valid users...");

    var parallelTasks = [];
    Object.keys(listsObj).forEach(function(continent){
      var members = listsObj[continent].map(function(handle){ return handle.replace('@', '').trim() });
      parallelTasks.push(function(callback){
        var writer = csvWriter({ sendHeaders: false, newline: ','});
        var fileName = examplesDir + continent.replace(/ /g,"_") + '.csv';
        console.log("Adding " + members.length + " members to "+ fileName + '...');
        writer.pipe(fs.createWriteStream(fileName));
        /**
        * This is hacky, find a better method.
        **/
        for(var j in members) {
          var member = members[j];
          writer.write({ members: member });
        }
        writer.end();
        return callback&&callback();
      });
    });

    async.parallel(parallelTasks, function(err){
      if(err) {
        console.log(err);
        return;
      }
      console.log("All done. You can use these files to add lists to twitter now!");
    });

  })
});

fs.createReadStream(inputFile).pipe(parser);

