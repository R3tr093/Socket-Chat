var socket = io.connect('http://localhost:8080');


var sendBtn = document.getElementById('sendBtn');

var chat = document.getElementById('chatFrame');

var pseudo = prompt(" Entrez un pseudo : ");

while(pseudo.length < 5)
{
  pseudo = prompt(" Entrez votre pseudo (5 caractères min ) : ")
}

socket.emit('new_entrance',pseudo);


document.getElementById('log').textContent = "Vous êtes connecté sous le pseudo : " + pseudo;


// Prevent if new users is logged in

socket.on('loggedIn', function(message) {

    chat.insertAdjacentHTML('afterbegin', '<p class="infos">' + message + '</p>');

  });


// Prevent if an user is disconnected.  
socket.on('logOut', function(message) {

    chat.insertAdjacentHTML('afterbegin', '<p class="infos">' + message + '</p>');

  });

  socket.on('userCount', function(message) {

  
    document.getElementById('count').textContent = message;
 



  });

  socket.on('message', function(user,message) {

    var chat = document.getElementById('chatFrame');

    var timed = document.getElementById('clock').textContent;

 
    chat.insertAdjacentHTML('afterbegin', '<p class="messagesElts"> <span class="PseudoElts">' + user + " : " + '</span>' + message + '<br><br> <span class="dateElts"> Envoyé à ' + timed +  '</span></p><hr>');



  });


  sendBtn.addEventListener('click',function(){
    
    var message = document.getElementById('messageArea').value;

    socket.emit('message',"", message);
     

    document.getElementById('messageArea').value = "";

  })



