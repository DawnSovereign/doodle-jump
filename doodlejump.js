// Define variables for the game board and doodler
let board; 
let boardWidth = 360;
let boardHeight = 576; 
let context; // Context for drawing on the canvas

// Define doodler properties
let doodlerWidth = 46;
let doodlerHeight = 46; 
let doodlerX = boardWidth/2 - doodlerWidth/2; // Initial X position of the doodler
let doodlerY = boardHeight*7/8 - doodlerHeight; // Initial Y position of the doodler
let doodlerRightImg; 
let doodlerLeftImg;

// game physics
let velocityX = 0; 
let velocityY = 0; //jump speed
let initialVelocityY = -8; //starting velocity Y
let gravity = 0.2;


//platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

// Define doodler object with its properties
let doodler = {
    img : null, // Image object for the doodler
    x : doodlerX, 
    y : doodlerY, 
    width : doodlerWidth, 
    height : doodlerHeight 
}

// Function to execute when the window loads
window.onload = function(){
    // Get reference to the game board canvas element
    board = document.getElementById("board");
    // Set the dimensions of the canvas
    board.height = boardHeight;
    board.width = boardWidth;
    // Get 2D rendering context of the canvas
    context = board.getContext("2d");

    // Load images for doodler
    doodlerRightImg = new Image(); 
    doodlerRightImg.src = "./doodler-right.png"; 
    doodler.img = doodlerRightImg; // Assign the image to the doodler object
    // Draw the doodler when the image is loaded
    doodlerRightImg.onload = function(){
        context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    }

    // Load image for left-facing doodler
    doodlerLeftImg = new Image(); 
    doodlerLeftImg.src = "./doodler-left.png";

    platformImg = new Image();
    platformImg.src = "./platform.png";

    
    velocityY = initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDoodler);
}

// Function to update the game state
function update(){
    // Request animation frame to update the game continuously
    requestAnimationFrame(update);
    // Clear the canvas for drawing new frames
    context.clearRect(0, 0, board.width, board.height);

    // Update doodler's position based on velocity
    doodler.x += velocityX;

    // Wrap doodler around the screen horizontally
    if(doodler.x > boardWidth){
        doodler.x = 0;
    }
    else if(doodler.x + doodler.width < 0){
        doodler.x = boardWidth;
    }

    velocityY += gravity;
    doodler.y += velocityY;

    // Draw the doodler on the canvas
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    //platforms
    for(i = 0; i < platformArray.length; i++){
        let platform = platformArray[i];
        if(detectCollision(doodler, platform ) && velocityY >= 0){
            velocityY = initialVelocityY; //jump off platform
        }

        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }
}

// handle doodler movement based on keyboard input
function moveDoodler(e){
    if(e.code == "ArrowRight" || e.code == "KeyD"){ 
        velocityX = 4; 
        doodler.img = doodlerRightImg; 
    } 
    else if(e.code == "ArrowLeft" || e.code == "KeyA"){ 
        velocityX = -4; 
        doodler.img = doodlerLeftImg; 
    }
}


function placePlatforms(){
    platformArray = [];

    //starting platforms
    let platform = {
        img : platformImg,
        x : boardWidth/2,
        y : boardHeight - 50,
        width : platformWidth,
        height : platformHeight     
    }

    platformArray.push(platform);

    platform = {
        img : platformImg,
        x : boardWidth/2,
        y : boardHeight - 150,
        width : platformWidth,
        height : platformHeight     
    }

    platformArray.push(platform);
}

function detectCollision(a, b){
    return a.x < b.x + b.width && //a's top left corner doesnt reach b's top right corner
           a.x + a.width > b.x && //a's top right corner passes b's top left corner
           a.y < b.y + b.height && //a's top left corner doesnt reach b's bottom left corner
           a.y + a.height > b.y; //a's bottom left corner doesnt reach b's top left corner
}