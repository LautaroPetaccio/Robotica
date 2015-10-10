/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({
  /**
   * constructor
   */
  
  /* -----
  
  constructor
  
  ------ */ 
  init: function(x, y, settings) {
  // call the constructor
  this._super(me.Entity, 'init', [x, y, settings]);

  this.renderable.width = this.width
  this.renderable.height = this.height;
  console.log("Sizes");
  console.log(this.renderable.width);
  console.log(this.renderable.height);

  /* Set the display to follow our position on both axis (in case the map is too big) */
  me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
 
  /* Ensure the player is updated even when outside of the viewport */
  this.alwaysUpdate = true;
 
  /* Defines the standing animation (using the first frame) */
  this.renderable.addAnimation("unique",  [0]);

  /* Set the unique animation to be rendered */
  this.renderable.setCurrentAnimation("unique");

  /* Defines viewport edges */
  this.maxX = me.game.viewport.width - this.width;
  this.maxY = me.game.viewport.height - this.height;

  /* Instruction movements to be excecuted */
  this.instructions = [];

  /* Stats used to update the robots position  */
  this.stats = {
    /* angle in radians */
    angle : this.renderable.angle,
    /* X position in the frame */
    x : x,
    /* Y position in the frame */
    y : y,
    /* Distance between the center of the two wheels, 30 pixels */
    l : 30,
  }
  },

  /* http://planning.cs.uiuc.edu/node659.html */
  moveRobot : function(leftMotor, rightMotor, time) {
  wheelRadious = 5;
  leftMotor *= time;
  rightMotor *= time;
  this.stats.x += (wheelRadious/2)*(leftMotor + rightMotor)*Math.cos(this.stats.angle);
  this.stats.y += (wheelRadious/2)*(leftMotor + rightMotor)*Math.sin(this.stats.angle);
  this.stats.angle += (wheelRadious/this.stats.l) * (rightMotor - leftMotor);
  },
  /* -----
 
  update the player pos
 
  ------ */
  update: function(dt) {
  this._super(me.Entity, 'update', [dt]);

  if(me.parser !== null) {
    /* Walk 3 times the tree */
    me.parser.childWalk();
    me.parser.childWalk();
    me.parser.childWalk();

    /* If there are instructions already walked by the parser, put them in the instructions array */
    if(me.parser.contextManager.instructions.length > 0) {
      this.instructions.push(me.parser.contextManager.instructions.shift());
    }
    /* If it's not paused and we have instructions to execute, excecute them */
    if(this.instructions.length > 0 && !me.parser.excecution.isPaused()) {
      switch(this.instructions[0].action) {
        case 'move':
          var duration = this.instructions[0].duration;
          var leftMotor = this.instructions[0].leftMotor;
          var rightMotor = this.instructions[0].rightMotor;

          this.moveRobot(leftMotor, rightMotor, dt / 1000);
          break;
      }

      this.pos.x = this.stats.x;
      this.pos.y = this.stats.y;
      this.renderable.angle = this.stats.angle;
      this.instructions[0].duration -= dt / 1000;
      if(this.instructions[0].duration <= 0) {
        this.instructions.shift();
      }
    }

    /* If we don't have instructions to excecute and the parser is marked as completed
      excecute the parser's onCompleted function.
     */
    if(this.instructions.length === 0 && me.parser.completed) {
      me.parser.onCompleted();
      me.parser.completed = false;
    }
  }

   /* Limits checking */

   if(this.pos.x <= 0) {
    this.pos.x = 0;
   }
   else if(this.pos.x >= this.maxX) {
    this.pos.x = this.maxX;
   }

   if(this.pos.y <= 0) {
    this.pos.y = 0;
   }
   else if(this.pos.y >= this.maxY) {
    this.pos.y = this.maxY;
   }

   /* Adding collision */

   me.collision.check(this);

   return true;
  },
   /**
   * colision handler
   * (called when colliding with other objects)
   */
  onCollision : function (response, other) {
    // Make all other objects solid
    return true;
  }
});
