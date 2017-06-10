var Twitter = require('twitter'),
config = require('./config');

module.exports = {
  addMembersToList: function(listName, ownerScreenName, membersToAdd, callback) {
    var postParams = {
      slug: listName,
      owner_screen_name: ownerScreenName,
      screen_name: membersToAdd
    };

    var client = new Twitter(config.auth);
    client.post('lists/members/create_all', postParams,  function(err, listDetails, response) {
      if(err) {
        return callback&&callback(err);
      }
      console.log("Succesfully added " + listDetails.member_count + " members to "+ listName);

      return callback&&callback();
    });
  }
}