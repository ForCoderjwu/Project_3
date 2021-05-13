/***********************************************************************************
  Project 3 - Mechanical revolution
  by Jiaquan Wu

  Uses the p5.2DAdventure.js class
------------------------------------------------------------------------------------
Note:
    - All notation will show behind the code it self.
    - The structure is easy to follow, becuase there are so many repeatable code 
      in this program.
    - The main structure is still base on the Scott's game structure. 
***********************************************************************************/

var clickablesManager;
var adventureManager;
var clickables;

var flag;
var star;
var font;
var font_b;
var font_r;
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
  font_r = loadFont('font/Kanit-Regular.ttf');
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
  adventureManager.getStateName() === "Splash2" ||
  adventureManager.getStateName() === "Instructions" ||
  adventureManager.getStateName() === "Characters" ||
  adventureManager.getStateName() === "END1" ||
  adventureManager.getStateName() === "END2" ||
  adventureManager.getStateName() === "END3" ||
  adventureManager.getStateName() === "END4") {
    ;
  }
  else if (adventureManager.getStateName() === "END5") {
    if (characters[PUBLIC].getStars() > 5 ){
      if (characters[COMPANY].getStars() > 5) ENDpage('As an engineer or tester on this project, your job is to make a belief between the company and public relationship. Base on your work in this operation experience, you have been shown to the public the exoskeleton can be a very helpful technology. In the future, more and more departments will equip this device.');
      else if (characters[FIRE].getStars() > 5) ENDpage('The public and the fire department are both like to you. Maybe the fire department will hire more peoples like you because you have been showing the benefits of this technology. Also, you and the public have a good reputation around it, so they will more acceptable for it.');
      else ENDpage("Not bad, even the fire department doesn't have any good reputation with the exoskeleton's work, but your decision has been showing to the public the meaning of this new technology.");
    } else if (characters[PUBLIC].getStars() < -3){
      ENDpage('You cannot earn the trust of the public, so nobody will use this kind of new technology in any area. Your operator work is done but never accomplish yet. You transfer to become the physical firefighter.')
    } else {
      if (characters[ARMY].getStars() > 5) ENDpage("Even you don't earn a full reputation around the public, but you show the military the feature and good versatility in many areas. So they will put more funding for it and transfer it into the military used in future warfare.");
      else ENDpage('Nothing special, you let the public know something about the new technology, but they are half support and half dislike this technology. The future of this device is much harder than we thought, but at least, the new technology will improve society.');
    }
  }
  else {
    drawCharacters();
  }
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

  clickables[39].onPress = F1_C1;
  clickables[40].onPress = F1_C2;
  clickables[42].onPress = F2_C2;
  clickables[45].onPress = F4_C1;
  clickables[46].onPress = F4_C2;
  clickables[49].onPress = F6_C1;
  clickables[50].onPress = F6_C2;
  clickables[51].onPress = F6_C3;
  clickables[52].onPress = F7_C1;
  clickables[53].onPress = F7_C2;
  clickables[54].onPress = F8_C1;
  clickables[55].onPress = F8_C2;
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

S5_C1 = function() {//Take elevator again, Random choice!
  characters[FIRE].subStar(2);
  characters[PUBLIC].subStar(2);
  if (int(random(0,2))) adventureManager.changeState('END2');
  else adventureManager.clickablePressed(this.name);
}

//Story 2
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

//Story 3
F1_C1 = function() {
  characters[FIRE].addStar(2);
  characters[OTHER].subStar(1);
  adventureManager.clickablePressed(this.name);
}
F1_C2= function() {
  characters[COMPANY].addStar(2);
  characters[OTHER].addStar(1);
  adventureManager.clickablePressed(this.name);
}

F2_C2= function() {
  characters[FIRE].addStar(1);
  characters[ARMY].addStar(1);
  characters[OTHER].subStar(1);
  adventureManager.clickablePressed(this.name);
}

F4_C1= function() {
  characters[COMPANY].addStar(2);
  characters[OTHER].addStar(2);
  characters[PUBLIC].subStar(2);
  adventureManager.clickablePressed(this.name);
}
F4_C2= function() {
  characters[ARMY].addStar(2);
  characters[OTHER].subStar(2);
  characters[PUBLIC].addStar(1);
  adventureManager.clickablePressed(this.name);
}

F6_C1= function() {
  characters[FIRE].addStar(3);
  characters[OTHER].addStar(2);
  adventureManager.clickablePressed(this.name);
}
F6_C2= function() {
  characters[OTHER].subStar(2);
  characters[PUBLIC].addStar(3);
  adventureManager.clickablePressed(this.name);
}
F6_C3= function() { //Random choose to end or keep.
  if (int(random(0,2))) adventureManager.changeState('END4');
  else adventureManager.clickablePressed(this.name);
}
F7_C1= function() {
  characters[COMPANY].addStar(2);
  characters[OTHER].subStar(3);
  characters[PUBLIC].addStar(1);
  adventureManager.clickablePressed(this.name);
}
F7_C2= function() {
  characters[ARMY].addStar(1);
  characters[FIRE].subStar(1);
  characters[PUBLIC].addStar(2);
  adventureManager.clickablePressed(this.name);
}
F8_C1= function() {
  characters[COMPANY].addStar(2);
  characters[OTHER].subStar(3);
  characters[PUBLIC].subStar(2);
  adventureManager.clickablePressed(this.name);
}
F8_C2= function() {
  characters[OTHER].subStar(2);
  characters[FIRE].addStar(1);
  characters[PUBLIC].addStar(3);
  adventureManager.clickablePressed(this.name);
}
// ---------------- class setup ------------------//
function loadAllText() { //text set up
  scenarioRooms = adventureManager.states;

  //Forward
  scenarioRooms[5].setText("Which department are you want to choose?","You are a graduate student who is testing the exoskeleton in the college. Your team just innovated the exoskeleton and it is fully functional. There are two main supporters in this project, which one did you want to talk to at first?");
  scenarioRooms[6].setText("Join for society or taking other jobs?","As your team working so hard, this program is completely successful, and you are on the graduation time in the college. At this time, a fire team in LA found you and asking \"Would you like to be a new operator for our exoskeleton?\"");

  //Story1
  scenarioRooms[7].setText("Which way do you want to use?","As you join the fire team, you will keep training some skills with your special fire-exoskeleton's teacher MOSS. As one day, a skyscraper in LA is put on fire. Your team is assigned to this mission, and team leader Lewis got two roads for you to enter this building.");
  scenarioRooms[8].setText("How do you put off the fire?","As you reach the top level, the heavy fire is fully blocked the path to the office. However, there are some human voices come from the back of the door.");
  scenarioRooms[9].setText("How do you want to get off this building?","You use the exoskeleton's function to remotely destroy the door and clean a small path to the office. Indeed, there are people inside and around by fire. You and your team put off this fire and keep their life safe. And now, how do you want to transfer them out?");
  scenarioRooms[10].setText("How do you want to get off this building?","You and your team using the fire system to put off the fire, and because of the exoskeleton's resource, you guys clear a very large path to the office. As the door opens, there are few people inside and around with fire. You and your team put off this fire and keep their life safe. And now, how do you want to transfer them out?");
  scenarioRooms[11].setText("How do you want to get off this building?","Your team ignore the voice from the office and spent all your time putting off this large fire. Because of the exoskeleton's help, the fire can be put off very quickly as you can.");
  
  scenarioRooms[12].setText("How would you like to do?","As your team is taking the elevator to go down, the elevator is broken in the middle of the way. Your team is stuck inside of the elevator and the fire is closing. At the same time, you find out an exit on the roof of the elevator.");
  scenarioRooms[13].setText("What would you like to do?","As your team exit the elevator from the roof, You find another elevator stops on the other side and it seems solid and safe. But also, you can open the floor door and takes the stair instead. You will choose?");
  scenarioRooms[14].setText("What would you like to do?", "Because of the exoskeleton's power, you can open the floor door and hold it safely until everyone exits the risk area. At the same time, you find out there is another elevator is docking on the same floor, you choose?");
  scenarioRooms[15].setText("Mission Success","Your team takes the elevator again, and by good luck, the elevator takes you down to the ground. All people in the elevator are safe and sound.");
  scenarioRooms[16].setText("Mission Success","Your team takes the stair to go back. It takes a little bit of time, but all people seem safe.");
  //from button
  scenarioRooms[17].setText("Which path did you want to choose?","Your team chooses to go from the button to the up stair, but there is two pathway. You will choose?");

  //Story 2
  scenarioRooms[18].setText("How do you feel about the action?","As some days later, you have so much experience in operating the exoskeleton. One day, two officers from the military come to your team and want you to teach their soldiers how to operate. They said this kind of exoskeleton will be used in the bomb disable action, and you doubt about it but still said yes to them.");
  scenarioRooms[19].setText("How do you want to traning them?","You went to the military camp and there are some new kinds of the exoskeleton are waiting and training in there. However, those soldiers cannot operate them as fluently as you can, and they cannot even move the heavy things as the basic skills. Do you choose to?");
  scenarioRooms[20].setText("How do you feel about this?","The training day is hard but it is easy for you. Some days later, as you talking to those soldiers in the leisure time, they said they come from the special operation group in the front line. You find about it from the internet, they are training to destroy and reconnaissance in the other counties. Do you choose to?");
  scenarioRooms[21].setText("How about the advance skills?", "They study very quickly and it is useful, but instead of the basic skills for them. The officer wants you to training them the advanced skills, like remote control and some new technology from the fire team. It seems they can use the remote control to disable the bomb without and risk, but this kind of skill also can be a weapon.");
  scenarioRooms[22].setText("Mission Success","The work is done, whatever they have learned in this program, you finish all the training programs for them.");

  //Story 3
  scenarioRooms[23].setText("What way would you like to use? ","After the army program is done, you think you have some days to take a rest. However, bad news has come to your ear. Because of human error, a nuclear power station is been overreacting and causing a very large fire with high radiation around it. Your team is assigned to rescue this land, but how would you like to do it?");
  scenarioRooms[24].setText("What is your reaction?","You choose to enter this area with physical controls, all citizens and human feels honored to you. However, after a while, you and your team feeling something is not right, because your body starts to blush and pain from your skin. What would you like to do?");
  scenarioRooms[25].setText("Accident happend","You assign your team to return to base and do a complete clean-up. Also, base on your feeling about the radiation level, you decide each member needs to wearing a much heavier protection suit to re-enter this area. The suit is very heavy but because the exoskeleton is updated by the ARMY, it doesn't have any side effect on your actions.");

  scenarioRooms[26].setText("What is your reaction?","You choose to enter this area with the remote control system, some people are talking about the late time of rescue action, but you know the team member's life is the most important thing. However, the radiation from this area is too high and it causes the wireless control to have a fatal error. Then you will choose to?");
  scenarioRooms[27].setText("Accident happend","Some remote exoskeleton comes back to base, then the engineer mounts up the wire control system and puts it back to the screen. It keeps working on that radiation and it can have the same reaction as the human's working.");
  scenarioRooms[28].setText("What is your choice?","Your team enters the main building of the nuclear power plant, but this place looks like hell because it surrounds by high radius material and fire. So, what do you want to do at first?");

  scenarioRooms[29].setText("How do you want to do?","You choose to clean up the fire first. Your team using many things to put off the fire surround this building and prevent this building not collapse. Nevertheless, the high radiation is still inside of this building, how do you want to treat it?");
  scenarioRooms[30].setText("How do you want to do?","You choose to clean the radiation material at first. Your team using many lead containers to save those materials and keep them no longer emit radiation. Nevertheless, because of the heavy fire are melt down the structure of the building and it starts to collapse. How is your reaction to it?");

  scenarioRooms[31].setText("Mission is closely done","You choose a cooperative way, do both actions at the same time. You assign the physical firefighter to put off the fire and the exoskeleton's fighter to get rid of those radiations. All members are hard-working to do their own jobs, and the luck is on your side, your team finishes all the action and does it perfectly.");
  scenarioRooms[32].setText("Mission is closely done","You think the building is a very dangerous place to stay, but the fire needs someone to clean up. So you told the exoskeleton's team to use the remote control to keep working on the fire extinguish job, and other firefighters to evacuate this screen. Finally, the fire destroyed much of the building and bury some rescue members. But at least, you save much of the citizens and keep very low radiation in this area. Good Job!");
  scenarioRooms[33].setText("Mission is closely done","You think the building can hold on for a while, so you assign all members to do all the jobs they can to put off this fire. Because you are using everything you have and the advantage of the exoskeleton, the fire finally is been put off. However, some place in the building is still damage and injured some members, but all members know, this might be the best situation for it.");

  scenarioRooms[34].setText("Mission is closely done","Even your team is wearing the most efficient suit to prevent the high radiation in the building, but you still think the radiation will damage all the human's body. So you order all members to evacuate this building and let the exoskeleton can do the work remotely. Finally, the work is done by the exoskeleton, but because they cannot do it in a very faster way, the radius value will affect this area in a much longer time.");
  scenarioRooms[35].setText("Mission is closely done","Because your team is wearing the most efficient protection suit and trust what your wear, all members choose to clean their up before evacuate. Finally, the radius value in this area is much lower than the scientific prediction, but you know, you and your team member have some kind of negative effect on it. But you still saving tons of life and gave a high reputation around the public.");
}

function ENDpage(texts){
  push();
  fill(255);
  textFont(font_r);
  textSize(30);
  text(texts,200,200,865,250);
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
          if (i < 4) image(flag, this.x + 70 + (i*30), this.y-30, 30, 30);
          else image(flag, this.x + 70 + (i*30) - 5 * 30, this.y, 30, 30);
        }
      } else {
        for( let i = 0; i < this.stars; i++ ) {
          if (i < 4) image(star, this.x + 70 + (i*30), this.y-30, 30, 30);
          else image(star, this.x + 70 + (i*30) - 4 * 30, this.y, 30, 30);
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
    // title text
    textFont(font);
    textSize(20);
    text(this.titleText, this.drawX , this.drawY-5);

    //body text
    textFont(font_b);
    fill('#65c294');
    textSize(30);
    text(this.bodyText, this.drawX , this.drawY + 60, width - (this.drawX*2),height - (this.drawY+100) );
    
    pop();
  }
}