// Speed Potion Scripts
$(document).ready(function(){
  $(".speed").click(function(){
    m = document.getElementById("money");
    if(parseInt(m.innerHTML) >= 50){
      if(speed == "false"){
        speed = "true";
        m.innerHTML = parseInt(m.innerHTML) - 50;
        alert("You bought double click.");
      }
      else{
        alert("You cannot buy double click twice.");
      }
    }
    else{
      alert("Sorry, you don't have enough money to buy double click.")
    }
  })
});

// Ten Seconds Scripts
$(document).ready(function(){
  $(".ten").click(function(){
    m = document.getElementById("money");
    if(parseInt(m.innerHTML) >= 100){
      if(ten == "false"){
        if(game_started == "true"){
          alert("You cannot buy 10 more seconds in the middle of the game.")
        }
        else{
          ten = "true";
          m.innerHTML = parseInt(m.innerHTML) - 100;
          alert("You now have 10 more seconds for the next game.");
        }
      }
      else{
        alert("You cannot buy 10 more seconds twice.");
      }
    }
    else{
      alert("Sorry, you don't have enough money to buy 10 more seconds.")
    }
  })
});

// Twenty Seconds Scripts
$(document).ready(function(){
  $(".twenty").click(function(){
    m = document.getElementById("money");
    if(parseInt(m.innerHTML) >= 200){
      if(twenty == "false"){
        if(game_started == "true"){
          alert("You cannot buy 20 more seconds in the middle of the game.")
        }
        else{
          twenty = "true";
          m.innerHTML = parseInt(m.innerHTML) - 200;
          alert("You now have 20 more seconds for the next game.");
        }
      }
      else{
        alert("You cannot buy 20 more seconds twice.");
      }
    }
    else{
      alert("Sorry, you don't have enough money to buy 20 more seconds.")
    }
  })
});

// Thirty Seconds Scripts
$(document).ready(function(){
  $(".thirty").click(function(){
    m = document.getElementById("money");
    if(parseInt(m.innerHTML) >= 300){
      if(thirty == "false"){
        if(game_started == "true"){
          alert("You cannot buy 30 more seconds in the middle of the game.")
        }
        else{
          thirty = "true";
          m.innerHTML = parseInt(m.innerHTML) - 300;
          alert("You now have 30 more seconds for the next game.");
        }
      }
      else{
        alert("You cannot buy 30 more seconds twice.");
      }
    }
    else{
      alert("Sorry, you don't have enough money to buy 30 more seconds.")
    }
  })
});

// Double Points
$(document).ready(function(){
  $(".dpoints").click(function(){
    m = document.getElementById("money");
    if(parseInt(m.innerHTML) >= 99){
      if(dpoints == "false"){
        if(tpoints == "true"){
          alert("Sorry, you cannot buy double point and triple point together.");
        }
        else if(qpoints == "true"){
          alert("Sorry, you cannot buy double point and quadruple point together.");
        }
        else{
          dpoints = "true";
          m.innerHTML = parseInt(m.innerHTML) - 99;
          alert("You bought double point.");
        }
      }
      else{
        alert("You cannot buy more than 1 double point.");
      }
    }
    else{
      alert("Sorry, you don't have enough money to buy double point.")
    }
  })
});

// Triple Point Script
$(document).ready(function(){
  $(".tpoints").click(function(){
    m = document.getElementById("money");
    if(parseInt(m.innerHTML) >= 199){
      if(tpoints == "false"){
        if(dpoints == "true"){
          alert("Sorry, you cannot buy triple point and double point together.");
        }
        else if(qpoints == "true"){
          alert("Sorry, you cannot buy triple point and quadruple point together.");
        }
        else{
          tpoints = "true";
          m.innerHTML = parseInt(m.innerHTML) - 199;
          alert("You bought triple point.");
        }
      }
      else{
        alert("You cannot buy more than 1 triple point.");
      }
    }
    else{
      alert("Sorry, you don't have enough money to buy triple point.")
    }
  })
});

// Quadruple Point Script
$(document).ready(function(){
  $(".qpoints").click(function(){
    m = document.getElementById("money");
    if(parseInt(m.innerHTML) >= 299){
      if(qpoints == "false"){
        if(dpoints == "true"){
          alert("Sorry, you cannot buy quadruple point and double point together.");
        }
        else if(tpoints == "true"){
          alert("Sorry, you cannot buy quadruple point and triple point together.");
        }
        else{
          qpoints = "true";
          m.innerHTML = parseInt(m.innerHTML) - 299;
          alert("You bought quadruple point.");
        }
      }
      else{
        alert("You cannot buy more than 1 quadruple point.");
      }
    }
    else{
      alert("Sorry, you don't have enough money to buy quadruple point.")
    }
  })
});

// Red Color
$(document).ready(function(){
  $(".red").click(function(){
    if(box_color != "red"){
      r = confirm("You have color red for your box, would you like to change that?");
      if (r == true) {
        if (shape == "triangle"){
          document.getElementById("box").style.borderColor = "transparent transparent red transparent";
        }
        else{
          document.getElementById("box").style.backgroundColor = "red";
        }
        box_color = "red";
        alert("Color of the box changed to color red.");
      }
    }
    else if(box_color == "red"){
      alert("You are using color red for your box");
    }
  });
});

// Orange Color
$(document).ready(function(){
  $(".orange").click(function(){
    m = document.getElementById("money");
    money = parseInt(m.innerHTML);
    if(money >= 500 && orange == "false"){
      if (shape == "triangle"){
        document.getElementById("box").style.borderColor = "transparent transparent #ff9900 transparent";
      }
      else{
        document.getElementById("box").style.backgroundColor = "#ff9900";
      }
      document.getElementById("orange").innerHTML = "Orange";
      orange = "true";
      box_color = "#ff9900";
      m.innerHTML = m.innerHTML - 500;
      alert("You bought color orange for your box."); 
    }
    else if(money < 500){
      alert("Sorry, you don't have enough money to buy color orange for your box.");
    }
    else if(box_color == "#ff9900"){
      alert("You are using color orange for your box.");
    }
    else if(orange == "true" && box_color != "#ff9900"){
      t = confirm("You have color orange for your box, would you like to change that?");
      if (t == true) {
        if (shape == "triangle"){
          document.getElementById("box").style.borderColor = "transparent transparent #ff9900 transparent";
        }
        else{
          document.getElementById("box").style.backgroundColor = "#ff9900";
        }
        box_color = "orange";
        alert("Color of the box changed to color orange.");
      }
    }
  });
});

// Yellow Color
$(document).ready(function(){
  $(".yellow").click(function(){
    m = document.getElementById("money");
    money = parseInt(m.innerHTML);
    if(money >= 500 && yellow == "false"){
      if (shape == "triangle"){
        document.getElementById("box").style.borderColor = "transparent transparent #FFFF00 transparent";
      }
      else{
        document.getElementById("box").style.backgroundColor = "#FFFF00";
      }
      document.getElementById("yellow").innerHTML = "Yellow";
      yellow = "true";
      box_color = "#FFFF00";
      m.innerHTML = m.innerHTML - 500;
      alert("You bought color yellow for your box."); 
    }
    else if(money < 500){
      alert("Sorry, you don't have enough money to buy color yellow for your box.");
    }
    else if(box_color == "#FFFF00"){
      alert("You are using color yellow for your box.");
    }
    else if(yellow == "true" && box_color != "#FFFF00"){
      t = confirm("You have color yellow for your box, would you like to change that?");
      if (t == true) {
        if (shape == "triangle"){
          document.getElementById("box").style.borderColor = "transparent transparent #FFFF00 transparent";
        }
        else{
          document.getElementById("box").style.backgroundColor = "#FFFF00";
        }
        box_color = "yellow";
        alert("Color of the box changed to color yellow.");
      }
    }
  });
});

// Square Shape
$(document).ready(function(){
  $(".square").click(function(){
    if(shape != "square"){
      s = confirm("You have shape square for your box, would you like to change that?");
      if (s == true) {
        document.getElementById("box").style.borderRadius="0px";
        document.getElementById("box").style.backgroundColor = box_color;
        document.getElementById("box").style.height = "40px";
        document.getElementById("box").style.width = "40px";
        document.getElementById("box").style.borderColor = "";
        document.getElementById("box").style.borderStyle = "";
        document.getElementById("box").style.borderWidth = "";
        shape = "square";
        alert("Shape of the box changed to square.");
      }
    }
    else if(shape == "square"){
      alert("You are using square.");
    }
  });
});

// Circle Shape
$(document).ready(function(){
  $(".circle").click(function(){
   m = document.getElementById("money");
    money = parseInt(m.innerHTML);
    box = document.getElementById("box");
    if(money >= 500 && circle == "false"){
      shape = "circle";
      circle = "true";
      document.getElementById("circle").innerHTML = "Circle";
      box.style.borderRadius="50px";
      box.style.backgroundColor = box_color;
      box.style.height = "40px";
      box.style.width = "40px";
      box.style.borderColor = "";
      box.style.borderStyle = "";
      box.style.borderWidth = "";
      m.innerHTML = money - 500;
      alert("You bought shape circle.");
    }
    else if(shape == "circle"){
      alert("You are using circle.");
    }
    else if(circle == "true" && shape != "circle"){
      c = confirm("You have shape circle for your box, would you like to change that?");
      if (c == true) {
      shape = "circle";
      box.style.borderRadius="50px";
      box.style.backgroundColor = box_color;
      box.style.height = "40px";
      box.style.width = "40px";
      box.style.borderColor = "";
      box.style.borderStyle = "";
      box.style.borderWidth = "";
      alert("Shape of the box changed to circle.");
      }
    }
    else{
      alert("Sorry, you don't have enough money to buy shape circle.");
    }
  });
});

// Triangle Shape
$(document).ready(function(){
  $(".triangle").click(function(){
   m = document.getElementById("money");
    money = parseInt(m.innerHTML);
    box = document.getElementById("box");
    if(money >= 500 && triangle == "false"){
      shape = "triangle";
      triangle = "true";
      document.getElementById("triangle").innerHTML = "Triangle";
      box.style.borderRadius="0px";
      box.style.borderColor = "transparent transparent " + box_color + " transparent";
      box.style.borderStyle = "Solid";
      box.style.borderWidth = "0px 20px 40px 20px";
      box.style.backgroundColor = "";
      box.style.height = "0px";
      box.style.width = "0px";
      m.innerHTML = money - 500;
      alert("You bought shape triangle.");
    }
    else if(shape == "triangle"){
      alert("You are using triangle.");
    }
    else if(triangle == "true" && shape != "triangle"){
      c = confirm("You have shape triangle for your box, would you like to change that?");
      if (c == true) {
      shape = "triangle";
      box.style.borderRadius="0px";
      box.style.borderColor = "transparent transparent " + box_color + " transparent";
      box.style.borderStyle = "Solid";
      box.style.borderWidth = "0px 20px 40px 20px";
      box.style.backgroundColor = "";
      box.style.height = "0px";
      box.style.width = "0px";
      alert("Shape of the box changed to triangle.");
      }
    }
    else{
      alert("Sorry, you don't have enough money to buy shape triangle.");
    }
  });
});

