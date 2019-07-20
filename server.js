// REQUIRE

var http = require('http');

var express = require('express');

var socket = require('socket.io');

var sass = require('sass');

var morgan = require('morgan');

var bodyParser = require('body-parser');


var app = require('express')();

var server = require('http').createServer(app);

var io = require('socket.io').listen(server);

var ent = require('ent');


// SET STATIC FOLDER

app.use(morgan('combined'))
.use(express.static(__dirname + '/static'));

var urlencodedParser = bodyParser.urlencoded({ extended: false });



// Set an array with all client pseudo connected.
var allClient = [];

var pseudo = "guest";


io.on('connection', function (socket) {
  
   


    // Where a new user is connected we broadcast to everyone.
    socket.on('new_entrance',function(pseudo){

        socket.pseudo =  ent.encode(pseudo); // Ensure to block XSS 

        allClient.push(pseudo);

        socket.broadcast.emit('loggedIn', " >>> " + socket.pseudo + " vient de se connecter.");
        socket.broadcast.emit('userCount', String(allClient.length) + " utilisateurs connectés.");
        socket.emit('userCount', String(allClient.length) + " utilisateurs connectés.");
        

    })

    // Where a new message is sent we broadcast to everyone.
    socket.on('message',function(user,message){

        message = ent.encode(message);
        socket.broadcast.emit('message',socket.pseudo, message);
        socket.emit('message', socket.pseudo, message);

    })

    // Where an user is disconnected we broadcast again.
    socket.on('disconnect', function() {
        
        allClient.forEach(function(element) {
            
            if(element === socket.pseudo)
            {
                socket.broadcast.emit('logOut', " >>> " + socket.pseudo + " vient de se déconnecter.");
                allClient.pop(element);
                socket.broadcast.emit('userCount', String(allClient.length) + " utilisateurs connectés.");
               
              
            }

          });
          
        
      
     });

});


app.get('/',function(req,res){

    res.render('index.pug');

})


server.listen(8080);