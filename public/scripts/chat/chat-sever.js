//var socket = require('socket.io');
var discord = require('../notifications/discord.js')

module.exports={
  startServer: function(server){
    var io = require('socket.io')(server);
    io.on('connection',function(socket){

      console.log('made socket connection',socket.id);

      socket.on('chat message', function(msg){

        User.findOne({username:msg.user}, function(err, user) {
          if(err){
            console.log(err);
          } else{
            var newMsgIn = {msg:msg.msg,isEric:msg.isEric}
            Msg.create(newMsgIn,function(err, newMsg){
              if(err){
                console.log(err);
              }else{
                
  
                if(newMsg.isEric == false){
                  discord.webHook("Chat message from: ");
                }
              }
            });
          }
        });
      });
    });
  }
}
