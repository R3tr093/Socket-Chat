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


  var clock = document.getElementById("clock");

   clock.textContent = String(hour) + ":" + String(min);
}

setClock();

setInterval(setClock,1000)