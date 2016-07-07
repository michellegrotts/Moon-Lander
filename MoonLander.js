/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// Declare all the variables
var canvas = document.getElementById("moonCanvas");
var context = canvas.getContext("2d");
var aPressed = false;
var fuel = 100;
// Velocity var
var vel;
var grav = 1.62;
var zeroPoint = 0;
var step = true;
var refresh;
var landerY;
var dy;
var impact = [];
//Set up shapes for drawing.
function rectangle(xLoc, yLoc, width, height, fill) {
    this.xLoc = xLoc;
    this.yLoc = yLoc;
    this.width = width;
    this.height = height;
    this.fill = fill;
    //This method fills everything in black for some reason.
    /*this.init = function() {
        context.fillSytle = this.fill;
        context.fillRect(this.xLoc, this.yLoc, this.width, this.height);
    };    */
}
// Clean the canvas. Build the sky.
var skyObj = new rectangle(0, 0, canvas.width, canvas.height, "#000000");
context.fillStyle = skyObj.fill;
context.fillRect(skyObj.xLoc, skyObj.yLoc, skyObj.width, skyObj.height);

//Build the ground. Buildl the moon.
var moonObj = new rectangle(0, 0.8 * canvas.height, canvas.width, 0.2 * canvas.height, "#848484");
context.fillStyle = moonObj.fill;
context.fillRect(moonObj.xLoc, moonObj.yLoc, moonObj.width, moonObj.height);

//Build the basic lander.
var landerObj = new rectangle((canvas.width / 2) - (canvas.width / 40), 1, canvas.width / 20, canvas.height / 13, "#74DF00");
context.fillStyle = landerObj.fill;
context.fillRect(landerObj.xLoc, landerObj.yLoc, landerObj.width, landerObj.height);
landerY = landerObj.yLoc;

//Build the fuel guage
var fuelObj = new rectangle(canvas.width - 20, 20, 10, 100, "yellow");
context.fillStyle = fuelObj.fill;
context.fillRect(fuelObj.xLoc, fuelObj.yLoc, fuelObj.width, fuelObj.height);

//Design the rocket jet
var rocketObj = new rectangle((canvas.width / 2) - (canvas.width / 50), landerY + landerObj.height, canvas.width / 25, canvas.height / 20, "yellow");

//Listen for the 'a' button
function listen() {
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    function keyDownHandler(e) {
        if (e.keyCode === 65) {
            aPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.keyCode === 65) {
            aPressed = false;
        }
    }
    return aPressed;
}

//Start the game when the 'Start' button is pushed
function start() {
    landerY = 1;
    aPressed = false;
    fuel = 100;
    zeroPoint = 0;
    shapes();
    refresh = setInterval(draw, 40);
}

//Build all the shapes each time the draw function runs
function shapes() {
    context.fillStyle = skyObj.fill;
    context.fillRect(skyObj.xLoc, skyObj.yLoc, skyObj.width, skyObj.height);
    
    context.fillStyle = moonObj.fill;
    context.fillRect(moonObj.xLoc, moonObj.yLoc, moonObj.width, moonObj.height);
    
    context.fillStyle = fuelObj.fill;
    context.fillRect(fuelObj.xLoc, fuelObj.yLoc + (100 - fuel), fuelObj.width, fuel);
    
    context.fillStyle = landerObj.fill;
    context.fillRect(landerObj.xLoc, landerY, landerObj.width, landerObj.height);
    
    fuelText();
    
    landerText();
};

//Displays the fuel level under the fuel bar
fuelText = function() {
    context.font = "10px Times";
    context.fillStyle = "red";
    context.fillText(fuel, fuelObj.xLoc, fuelObj.yLoc + fuelObj.height + 10);
};

//Displays the word "Land" on the lander
landerText = function() {
    context.font = "10px Times";
    context.fillStyle = "red";
    context.fillText("Land", landerObj.xLoc, landerY + 15);
};

//Draw the canvas and move the objects
function draw() {
    canvas = document.getElementById("moonCanvas");
    context = canvas.getContext("2d");
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    shapes();
    
    fuelText();
    
    listen();
    //Calculate the velocity based on gravity and the last zero velocity point
    if (landerY >= zeroPoint) {
        vel = Math.sqrt(2 * grav * (landerY - zeroPoint +1));
    }
    else {
        vel = Math.sqrt(2 * grav * landerY);
    }
    
    //If 'a' is pressed, move up 5, set the zeroPoint to the current Y position.
    if ((aPressed) && ((landerY + landerObj.height) < moonObj.yLoc) && (fuel > 0)) {
        dy = -5;
        fuel -= 5;
        zeroPoint = landerY + dy;
        context.fillStyle = rocketObj.fill;
        context.fillRect(rocketObj.xLoc, landerY + landerObj.height, rocketObj.width, rocketObj.height);
    }
    //If lander is on the moon, and the velocity is over 11.2 m/s, stop and lose
    else if (((landerY + landerObj.height) >= moonObj.yLoc) && vel >= 11.2) {
        //Stop moving
        dy = 0;
        //Display the final velocity and display the win/lose status with the user
        context.font = "10px Times";
        context.fillStyle = "blue";
        context.fillText("Impact velocity: " + vel, (canvas.width / 2) - 75, moonObj.yLoc + 20);
        confirm("You Lose!");
        //document.location.reload(true);
        clearInterval(refresh);
    }
    //If lander is on the moon and velocity is under 11.2 m/s, stop and win
    else if ((landerY + landerObj.height) >= moonObj.yLoc) {
        //Stop moving
        dy = 0;
        //Display the final velocity and confirm the win/lose status with the user
        context.font = "10px Times";
        context.fillStyle = "blue";
        context.fillText("Impact velocity: " + vel, (canvas.width / 2) - 75, moonObj.yLoc + 20);
        confirm("You landed safely! You win!");
        //document.location.reload(true);
        clearInterval(refresh);
    }
    //Otherwise, keep going
    else {
        dy = vel;
    }
    //Move the lander
    landerY += dy;
};