var config = require('./config'),
fs = require('fs'),
parse = require('csv-parse'),
async = require('async'),
list = require('./list');

var inputFile = 'members.csv';
var asyncTasks = [];

var parser = parse({delimiter: ','}, function (err, data) {
  var membersToAdd = data[0];
  var numMembers = membersToAdd.length;
  if(numMembers > 5000) {
    console.log("A maximum of 5000 members can be added to a list. Please reduce the number of members and try again.");
    return false;
  }

  var membersToAddArr = [];
  while(membersToAdd.length) {
    var members = membersToAdd.splice(0, 51).map(function(handle){ return handle.replace('@', '').trim() }).join(',');
    membersToAddArr.push(members);
  }

  membersToAddArr.forEach(function(members){
    asyncTasks.push(function(callback){
      setTimeout(function(){
        var membersAdded = function(err) {
          if(err) {
            return callback&&callback(err);
          }
          return callback&&callback();
        };
        list.addMembersToList(config.userDetails.listName, config.userDetails.yourHandle, members, membersAdded);
      }, 5000);
    });
  });

  async.series(asyncTasks, function(err){
    if(err) {
      console.log(err);
      return false;
    }
  });
});

fs.createReadStream(inputFile).pipe(parser);

