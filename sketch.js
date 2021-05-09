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

var flag;
var star;
var font;
var font_b;
var characterImages = [];

var characters = [];        // array of charactes

const COMPANY = 0;
const ARMY = 1;
const PUBLIC = 2;
const FIRE = 3;
const OTHER = 4;

function preload() {
  font = loadFont('font/Kanit-Black.ttf');
  font_b = loadFont('font/Kanit-Bold.ttf');
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
  adventureManager.getStateName() === "Intro" ||
  adventureManager.getStateName() === "Splash" ||
  adventureManager.getStateName() === "Instructions" ||
  adventureManager.getStateName() === "Characters" ||
  adventureManager.getStateName() === "END1" ||
  adventureManager.getStateName() === "END2" ||
  adventureManager.getStateName() === "END3" ||
  adventureManager.getStateName() === "END4" ||
  adventureManager.getStateName() === "END5") {
    ;
  }
  else {
    drawCharacters();
  }

  drawDebugInfo();
}

//------------------- Clickable setup ------------------//
function setupClickables() {
  // All clickables to have same effects
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;
    clickables[i].width = 310;
    clickables[i].height = 53;
    clickables[i].strokeWeight = 0;
    clickables[i].textFont = font;
    clickables[i].textSize = 15;
    clickables[i].onPress = clickableButtonPressed;
  }

  //clickables[0].onPress = clickableButtonPressed;

  clickables[1].onPress = B1_C1;
  clickables[2].onPress = B1_C2;
  clickables[3].onPress = B2_C1;
  clickables[5].onPress = S1_C1;//
  clickables[6].onPress = S1_C2;
  clickables[7].onPress = S2_C1;
  clickables[8].onPress = S2_C2;
  clickables[9].onPress = S2_C3;

  for (let i = 10; i < 16; i++) {
    if (i%2 == 0) clickables[i].onPress = S3_C1;
    else clickables[i].onPress = S3_C2;
  }

  clickables[16].onPress = S4_C1;
  clickables[17].onPress = S4_C2;

  for (let i = 18; i < 22; i++) {
    if (i%2 == 0) clickables[i].onPress = S5_C1;
    else clickables[i].onPress = S3_C2;
  }

  clickables[26].onPress = S3_C1;
  clickables[27].onPress = S3_C2;

  clickables[28].onPress = D1_C1;
  clickables[29].onPress = D1_C2;
  clickables[30].onPress = D2_C1;
  clickables[31].onPress = D2_C2;
  clickables[32].onPress = D3_C1;
  clickables[33].onPress = D3_C2;
  clickables[34].onPress = D3_C3;
  clickables[35].onPress = D2_C1;
  clickables[36].onPress = D2_C2;
  // clickables[37].onPress = D5_C1;
  // clickables[38].onPress = D5_C2;
}
// tint when mouse is over
clickableButtonHover = function () {
  this.color = "#AAAAAA";
}

// color a light gray if off
clickableButtonOnOutside = function () {
  this.color = "#FFFFFF";
}

clickableButtonPressed = function() {
  adventureManager.clickablePressed(this.name);
} 

function mouseReleased() {
  // dispatch all mouse events to adventure manager
  adventureManager.mouseReleased();
}

// ----------------- Each Choice -----------------//

B1_C1 = function() { //backstory, Army 
  characters[1].addStar(2);
  characters[0].addStar(2);
  adventureManager.clickablePressed(this.name);
}

B1_C2 = function() { //or Public
  characters[4].addStar(1);
  characters[3].addStar(1);
  adventureManager.clickablePressed(this.name);
}

B2_C1 = function() {//backstory, join
  characters[3].addStar(2);
  characters[4].addStar(1);
  adventureManager.clickablePressed(this.name);
}

//Story 1
S1_C1 = function() {//From Up
  characters[1].addStar(1);
  characters[0].addStar(1);
  adventureManager.clickablePressed(this.name);
}
S1_C2 = function() {//From down, still develop
  characters[FIRE].addStar(2);
  characters[OTHER].addStar(1);
  adventureManager.clickablePressed(this.name);
}

S2_C1 = function() {//From Office, break through
  characters[2].addStar(2);
  characters[0].addStar(1);
  adventureManager.clickablePressed(this.name);
}
S2_C2 = function() {//From Office, clear fire
  characters[3].addStar(2);
  characters[4].addStar(1);
  adventureManager.clickablePressed(this.name);
}
S2_C3 = function() {//From Office, ignore
  characters[2].subStar(4);
  characters[4].subStar(2);
  adventureManager.clickablePressed(this.name);
}

S3_C1 = function() {//Take elevator
  characters[1].addStar(1);
  characters[3].subStar(2);
  characters[4].subStar(1);
  adventureManager.clickablePressed(this.name);
}
S3_C2 = function() {//Take stair
  characters[3].addStar(2);
  characters[4].addStar(1);
  adventureManager.clickablePressed(this.name);
}

S4_C1 = function() {//Take roof
  characters[ARMY].addStar(1);
  characters[COMPANY].addStar(1);
  characters[OTHER].subStar(2);
  adventureManager.clickablePressed(this.name);
}
S4_C2 = function() {//Take door
  characters[OTHER].addStar(2);
  characters[FIRE].addStar(1);
  adventureManager.clickablePressed(this.name);
}

S5_C1 = function() {//Take elevator again
  characters[FIRE].subStar(2);
  characters[PUBLIC].subStar(2);
  adventureManager.clickablePressed(this.name);
}

D1_C1 = function() { //Feel good
  characters[OTHER].addStar(1);
  characters[PUBLIC].subStar(2);
  characters[COMPANY].addStar(2);
  adventureManager.clickablePressed(this.name);
}
D1_C2 = function() {//Not good
  characters[ARMY].subStar(2);
  characters[PUBLIC].addStar(3);
  adventureManager.clickablePressed(this.name);
}
D2_C1 = function() {//Not Serious
  characters[ARMY].subStar(2);
  characters[COMPANY].subStar(2);
  characters[OTHER].addStar(1);
  adventureManager.clickablePressed(this.name);
}
D2_C2 = function() {//serious
  characters[ARMY].addStar(2);
  characters[PUBLIC].addStar(1);
  characters[COMPANY].addStar(2);
  adventureManager.clickablePressed(this.name);
}
D3_C1 = function() { //Help
  characters[PUBLIC].addStar(3);
  characters[ARMY].subStar(3);
  adventureManager.clickablePressed(this.name);
}
D3_C2 = function() {//Not help
  characters[ARMY].addStar(3);
  characters[PUBLIC].subStar(2);
  adventureManager.clickablePressed(this.name);
}
D3_C3 = function() {//Not my business
  characters[OTHER].subStar(1);
  characters[FIRE].addStar(2);
  adventureManager.clickablePressed(this.name);
}
D5_C1 = function() { //option 1 for D5

}
D5_C2 = function() { //option 2 for D5

}
// ---------------- class setup ------------------//
function loadAllText() { //text set up
  scenarioRooms = adventureManager.states;

  //Forward
  scenarioRooms[4].setText("Which department are you want to choose?","You are a graduate student who is testing the exoskeleton in the college. Your team just innovation the exoskeleton and it is fully functional. There are two main supporter in this project, which one did you want to talk to at first?");
  scenarioRooms[5].setText("Join for society or taking other jobs?","As your team working so hard, this program are success completely, and you are on the graduation time in the college. In this time, a fire team in LA found you and asking \"Would you like to be a new operator for our exoskeleton?\"");

  //Story1
  scenarioRooms[6].setText("Which way do you want to use?","As you join the fire team, you will keep training some skills with your fire-exoskeleton's teacher MOSS. As one day, a skyscraper in LA is put on fire. Your team are assign to this mission, and team leader Lewis got two road for you to enter this building.");
  scenarioRooms[7].setText("How do you put off the fire?","As you reach the top level, the heavy fire is fully blocked the path to the office. However, there are some human's voice come from the back of the door.");
  scenarioRooms[8].setText("How do you want to get off this building?","You use the exoskeleton's function to remotely destroy the door and clean a small path to the office. Indeed, there are people inside and sorund with fire. You and your team put off this fire and keep their life save. And now, how do you want to transfer them out?");
  scenarioRooms[9].setText("How do you want to get off this building?","You and your team using the fire system to put off the fire, and becuase of the exoskeleton's resource, you guys clear a very large path to the office. As the door open, there are few people inside and sorund with fire. You and your team put off this fire and keep their life save. And now, how do you want to transfer them out?");
  scenarioRooms[10].setText("How do you want to get off this building?","Your team ignore the voice from the office, and spent all your time to put off this large fire. Becuase of the exoskeleton's help, the fire can be put off very quickly as you can.");
  
  scenarioRooms[11].setText("How would you like to do?","As your team are taking the elevator to go down, the elevator are broken in the middle of the way. Your team are stuck inside of the elevator and the fire is closing. At the same time, you find out a exit on the roof of the elevator.");
  scenarioRooms[12].setText("What would you like to do?","As your team exit the elevator from roof, You find another elevator are stop in the otherside and it seems solid and safe. But also, you can open the floor door and takes the stair instead. You will choose?");
  scenarioRooms[13].setText("What would you like to do?", "Becuase of the exoskeleton's power, you can open the floor door and hold it safely until eveyone exit the risk area. In the same time, you find out there is another elevator is docking in the same floor, you choose?");
  scenarioRooms[14].setText("Mission Success","Your team takes the elevator again, and by the good luck, the elevator takes you down to the ground. All people in the elevator are safe and sound.");
  scenarioRooms[15].setText("Mission Success","Your team takes the stair to going back. It takes a little bit of time, but all people seems safe.");
  //from button
  scenarioRooms[16].setText("Which path did you want to choose?","Your team choose to go from the button to the up stair, but there are two pathway. You will choose?");
  // scenarioRooms[8].setText("","");

  //Story 2
  scenarioRooms[17].setText("How do you feel about the action?","As some days later, you have so many experience in operate the exoskeleton. Oneday, two officers from the military come to your team and want you to teach their soldier how to operated. They said this kind of exoskeleton will used in the bomb disable action, and you doubt about it but still said yes to them.");
  scenarioRooms[18].setText("How do you want to traning them?","You went to the military camp and there are some new kind of exoskeleton are waiting and training in there. However, those soilders cannot operate them as fluence as you can, and they cannot even move the heavy things as the basic skills. You choose to?");
  scenarioRooms[19].setText("How do you feel about this?","The training day is hard but it is easy for you. Some days later, as you talking to those soilders in the leisure time, they said they are come from the special operation group in the front line. You find about it from the internet, they are training to destroy and reconnaissance in the other counties. You choose to?");
  scenarioRooms[20].setText("How about the advance skills?", "They study very quickly and it is useful, but instead of the basic skills for them. The officer wants you to training them the advance skills, like remote control and some new technology from the fire team. It seems they can use the remote control to disable the bomb without and risk, but this kind of skills also can be a weapons.");
  scenarioRooms[21].setText("Mission Success","The work is done, whatever they have learn in this program, you finish all the training program for them.");
}

function drawDebugInfo() {
  push();
	fill(255);
  text("X: " + mouseX + "   Y: " + mouseY, 20, height - 20);
  pop();
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
    characters[i].setup(characterImages[i], 50 + (i*250), 50);
  }

  //Start score
  characters[PUBLIC].addStar(2);
  characters[ARMY].addStar(1);
  characters[COMPANY].addStar(1);
  characters[FIRE].subStar(1);
  characters[OTHER].subStar(2);

  //Test score
  // characters[ARMY].subStar(7);
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
    this.max = 7;
  }

  setup(img, x, y) {
    this.image = img;
    this.x = x;
    this.y = y;
    this.stars = 0;
  }
  
  draw() {
    if( this.image ) {
      push();
      // draw the character icon
      imageMode(CENTER);
      image( this.image, this.x, this.y,100,100);

      // draw logos
      if (this.stars < 0) {
        for( let i = 0; i < -(this.stars); i++ ) {
          if (i < 5) image(flag, this.x + 70 + (i*30), this.y-30, 30, 30);
          else image(flag, this.x + 70 + (i*30) - 5 * 30, this.y, 30, 30);
        }
      } else {
        for( let i = 0; i < this.stars; i++ ) {
          if (i < 5) image(star, this.x + 70 + (i*30), this.y-30, 30, 30);
          else image(star, this.x + 70 + (i*30) - 5 * 30, this.y, 30, 30);
        }
      }
      pop();
    }
  }

  getStars() {
    return this.stars;
  }

  // add, check for max overflow
  addStar(amt) {
    this.stars += amt;
    if( this.stars > this.max ) {
      this.stars = this.max;
    }
  }

  // sub, check for below zero
  subStar(amt) {
    this.stars -= amt;
    if( this.stars < -this.max ) {
      this.stars = -this.max;
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
    this.drawY = 155;
    this.drawX = 140;
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
    // this calls PNGRoom.draw()
    super.draw();
    
    push();
    textFont(font_b);
    // title text
    textSize(20);

    text(this.titleText, this.drawX , this.drawY);

    textFont(font);
    fill('#65c294');
    textSize(30);

    text(this.bodyText, this.drawX , this.drawY + 60, width - (this.drawX*2),height - (this.drawY+100) );
    
    pop();
  }
}