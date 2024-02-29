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

// Define doodler object with its properties
let doodler = {
    img : null, // Image object for the doodler
    x : doodlerX, 
    y : doodlerY, 
    width : doodlerWidth, 
    height : doodlerHeight 
}


// game physics
let velocityX = 0; 
let velocityY = -2; //jump speed
let initialVelocityY = -5.5; //starting velocity Y
let gravity = 0.07;


//platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let score = 0;


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

    //clear platforms
    while(platformArray.length > 0 && platformArray[0].y >= boardHeight){
        platformArray.shift(); //removes first element in array 
        newPlatform();
    }


    //platforms
    for(i = 0; i < platformArray.length; i++){
        let platform = platformArray[i];
        if(velocityY < 0 && doodler.y < boardHeight*3/4){
            platform.y -= initialVelocityY; //slide platforms down
        }
        if(detectCollision(doodler, platform ) && velocityY >= 0){
            velocityY = initialVelocityY; //jump off platform
        }

        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

        //score
        updateScore();
        context.fillStyle = "black";
        context.font = "16px sans-serif";
        context.fillText(score, 5, 20);

}

// handle doodler movement based on keyboard input
function moveDoodler(e){
    if(e.code == "ArrowRight" || e.code == "KeyD"){ 
        velocityX = 1.5; 
        doodler.img = doodlerRightImg; 
    } 
    else if(e.code == "ArrowLeft" || e.code == "KeyA"){ 
        velocityX = -1.5; 
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

    // platform = {
    //     img : platformImg,
    //     x : boardWidth/2,
    //     y : boardHeight - 150,
    //     width : platformWidth,
    //     height : platformHeight     
    // }

    // platformArray.push(platform);

    for(let i = 0; i < 6; i++){
        let randomX = Math.floor(Math.random() * boardWidth*3/4); //(0-1) * boardWidth*3/4
        let platform = {
            img : platformImg,
            x : randomX,
            y : boardHeight - 75*i - 150,
            width : platformWidth,
            height : platformHeight     
        }
    
        platformArray.push(platform);
    }
}

//preloads the next set of platforms
function newPlatform(){
    let randomX = Math.floor(Math.random() * boardWidth*3/4); //(0-1) * boardWidth*3/4
        let platform = {
            img : platformImg,
            x : randomX,
            y : -platformHeight,
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

function updateScore(){
    let points = Math.floor(50*Math.random());//(0-1)*50 --> (0-50)
    score += points;
}