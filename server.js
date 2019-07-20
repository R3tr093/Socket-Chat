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



// Set internal clock


var time = "00:00";

function setClock ()
{
  var d = new Date();

  var hour = d.getHours();

  var min = d.getMinutes();

  if(hour < 10)
  {
    hour = "0" + String(hour);
  }

  if(min < 10)
  {
    min = "0" + String(min);
  }


   time = String(hour) + ":" + String(min);
}

setClock();

setInterval(setClock,1000)


// SET STATIC FOLDER

app.use(morgan('combined'))
.use(express.static(__dirname + '/static'));

var urlencodedParser = bodyParser.urlencoded({ extended: false });



// Set an array with all client pseudo connected.
var allClient = [];


// wait for it... ur not prepared.
var pseudoData = [];
var messagesData = [];
var timeData = [];

var pseudo = "guest";


io.on('connection', function (socket) {
  

    for ( var i = 0; i < messagesData.length;i++)
    {
        socket.emit('recup', pseudoData[i],messagesData[i],timeData[i]);
    }


   


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


        // U dont believe it, but yeah it's my db... problem ?
        pseudoData.push(socket.pseudo);
        messagesData.push(message);
        timeData.push(time);


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