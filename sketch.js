/***********************************************************************************
    Project 3 - Mechanical revolution
    by Jiaquan Wu

    Uses the p5.2DAdventure.js class
------------------------------------------------------------------------------------
Note:
    - 
***********************************************************************************/

var clickablesManager;
var adventureManager;
var clickables;

var maxLOGO;

var flag;
var star;
var characterImages = [];

var characters = [];        // array of charactes

function preload() {
  star = loadImage('assets/star.png');
  flag = loadImage('assets/bk_flag.png');
  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');
  
  allocateCharacters();
}

function setup() {
  createCanvas(1280, 720);

  clickables = clickablesManager.setup();
  adventureManager.setClickableManager(clickablesManager);
  adventureManager.setup();

  loadAllText();

  setupClickables(); 
}

function draw() {
  background(0);
  adventureManager.draw();
  clickablesManager.draw();

  if(
  adventureManager.getStateName() === "Splash" ||
  adventureManager.getStateName() === "Instructions" ||
  adventureManager.getStateName() === "Characters") {
    ;
  } else {
    drawCharacters();
  }
}

//------------------- Clickable setup ------------------//
function setupClickables() {
  // All clickables to have same effects
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;
    if (i>=1) {
      clickables[i].width = 300;
    }
  }
  clickables[0].onPress = clickableButtonPressed;
}
// tint when mouse is over
clickableButtonHover = function () {
  this.color = "#AA33AA";
  this.noTint = false;
  this.tint = "#FF0000";
}

// color a light gray if off
clickableButtonOnOutside = function () {
  // backto our gray color
  this.color = "#AAAAAA";
}

clickableButtonPressed = function() {
  adventureManager.clickablePressed(this.name);
} 

function mouseReleased() {
  // dispatch all mouse events to adventure manager
  adventureManager.mouseReleased();
}

// ---------------- class setup ------------------//
function loadAllText() { //text set up
  scenarioRooms = adventureManager.states;

  scenarioRooms[3].setText("Which department are you want to choose?","Your team just innovation the exoskeleton and it is fully functional. There are two main supporter in this project, which one did you want to talk to at first?");
}

// --------------- Character setup ------------------ //
function allocateCharacters() {
  // load the images
  characterImages[0] = loadImage("assets/COMPANY.png");
  characterImages[1] = loadImage("assets/ARMY.png");
  characterImages[2] = loadImage("assets/PUBLIC.png");
  characterImages[3] = loadImage("assets/FIRE.png");
  characterImages[4] = loadImage("assets/OTHER.png");

  for( let i = 0; i < characterImages.length; i++ ) {
    characters[i] = new Character();
    characters[i].setup( characterImages[i], 100 + (400 * parseInt(i/2)), 120 + (i%2 * 120));
  }

  // default anger is zero, set up some anger values
  characters[2].addAnger(2);
}

function drawCharacters() {
  for( let i = 0; i < characters.length; i++ ) {
    characters[i].draw();
  }
}

//------------------- Class ------------------------//

class Character {
  constructor() {
    this.image = null;
    this.x = width/2;
    this.y = width/2;
  }

  setup(img, x, y) {
    this.image = img;
    this.x = x;
    this.y = y;
    this.anger = 0;
  }
  
  draw() {
    if( this.image ) {
      push();
      // draw the character icon
      imageMode(CENTER);
      image( this.image, this.x, this.y,100,100);

      // draw anger emojis
      for( let i = 0; i < this.anger; i++ ) {
        image(star, this.x + 70 + (i*40), this.y +10, 50, 50);
      }

      pop();
    }
  }

  getAnger() {
    return this.anger;
  }

  // add, check for max overflow
  addAnger(amt) {
    this.anger += amt;
    if( this.anger > maxLOGO ) {
      this.anger = maxLOGO;
    }
  }

  // sub, check for below zero
  subAnger(amt) {
    this.anger -= amt;
    if( this.anger < 0 ) {
      this.anger = 0;
    }
  }

  // add, check for max overflow
  addAnger2(amt) {
    this.anger += amt;
    if( this.anger > maxLOGO ) {
      this.anger = maxLOGO;
    }
  }

  // sub, check for below zero
  subAnger2(amt) {
    this.anger -= amt;
    if( this.anger < 0 ) {
      this.anger = 0;
    }
  }
}

  class ScenarioRoom extends PNGRoom {
    // Constructor gets calle with the new keyword, when upon constructor for the adventure manager in preload()
    constructor() {
        super();    // call super-class constructor to initialize variables in PNGRoom
    
        this.titleText = "";
        this.bodyText = "";
    }
  
    // should be called for each room, after adventureManager allocates
    setText( titleText, bodyText ) {
        this.titleText = titleText;
        this.bodyText = bodyText;
        this.drawY = 360;
        this.drawX = 52;
    }
  
    // call the PNGRoom superclass's draw function to draw the background image
    // and draw our instructions on top of this
    draw() {
        // this calls PNGRoom.draw()
        super.draw();
        
        push();

        // title text
        fill(255);
        textAlign(LEFT);
        // textFont(headlineFont);
        textSize(36);

        text("How do we feel?", this.drawX , 60);

        // title text
        textSize(30);

        text(this.titleText, this.drawX , this.drawY);

        // Draw text in a box
        //text(this.titleText, width/6, height/6, this.textBoxWidth, this.textBoxHeight );

        // textFont(bodyFont);
        textSize(24);

        text(this.bodyText, this.drawX , this.drawY + 60, width - (this.drawX*2),height - (this.drawY+100) );
        
        pop();
    }
}