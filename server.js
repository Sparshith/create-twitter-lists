var config = require('./config');
var Twitter = require('twitter');
var client = new Twitter(config.auth); 

var handles = "so_radhikal,sayan_sanyal,pujabhattach";

var postParams = {
  slug: 'test',
  owner_screen_name: 'SparshithSampat',
  screen_name: handles
}

client.post('lists/members/create_all', postParams,  function(error, listDetails, response) {
  if(error) {
    console.log(error);
    return;
  }

  console.log("Finished adding members");

});