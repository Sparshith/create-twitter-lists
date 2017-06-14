var Twitter = require('twitter'),
config = require('./config');

module.exports = {
  addMembersToList: function(listName, ownerScreenName, membersToAdd, callback) {
    var postParams = {
      slug: listName,
      owner_screen_name: ownerScreenName,
      screen_name: membersToAdd
    };

    var client = new Twitter(config.auth.twitter);
    client.post('lists/members/create_all', postParams,  function(err, listDetails, response) {
      if(err) {
        return callback&&callback(err);
      }
      console.log("Succesfully added " + listDetails.member_count + " members to "+ listName);

      return callback&&callback();
    });
  },
  getMembers: function(listName, ownerScreenName, numUsers, callback) {
    var getParams = {
      slug: listName,
      owner_screen_name: ownerScreenName,
      count: numUsers,
      include_entities: false
    };

    var client = new Twitter(config.auth.twitter);
    client.get('lists/members', getParams,  function(err, members, response) {
      if(err) {
        return callback&&callback(err);
      }

      var listMemberHandles = [];
      for(var i in members.users) {
        var member = members.users[i];
        listMemberHandles.push(member.screen_name);
      }

      return callback&&callback(null, listMemberHandles);
    });
  }
}