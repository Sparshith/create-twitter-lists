var config = require('./config');
var Twitter = require('twitter');
var client = new Twitter(config.auth); 

var listName = 'test';
var membersToAdd = 'so_radhikal,sayan_sanyal,pujabhattach';
var yourHandle = 'SparshithSampat';


var postParams = {
  slug: listName,
  owner_screen_name: yourHandle,
  screen_name: membersToAdd
}

client.post('lists/members/create_all', postParams,  function(error, listDetails, response) {
  if(error) {
    console.log(error);
    return;
  }

  console.log("Finished adding members");

});