/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({
  /* -----
  
  constructor
  
  ------ */ 
  init: function(x, y, settings) {
    // call the constructor
    this._super(me.Entity, 'init', [x, y, settings]);

    this.renderable.width = this.width
    this.renderable.height = this.height;

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

    /* Distance between the center of the two wheels, 30 pixels */
    this.l = 30;
  },

  /* http://planning.cs.uiuc.edu/node659.html */
  moveRobot : function(leftMotor, rightMotor, time) {
    wheelRadious = 5;
    leftMotor *= time;
    rightMotor *= time;  
    this.pos.x = this.pos.x + (wheelRadious/2)*(leftMotor + rightMotor)*Math.cos(this.renderable.angle);
    this.pos.y = this.pos.y + (wheelRadious/2)*(leftMotor + rightMotor)*Math.sin(this.renderable.angle);
    this.renderable.angle += (wheelRadious/this.l) * (leftMotor - rightMotor);
  },

  updateSensors: function(sensorName) {

  },

  /* -----
 
  update the player pos
 
  ------ */
  update: function(dt) {
    this._super(me.Entity, 'update', [dt]);
    if(me.interpreter !== null && !me.execution.hasFinished()) {
      /* If the instructions waiting to be excecuted are lower than 1000 */
      if(me.interpreter.robotInstructions.length < 1000) {
        /* Do 10 steps with the interpreter */
        for (var i = 0; i < 10; i++) {
          /* If we don't have instructions to excecute and the interpreter is marked as completed
            excecute the interpreter's onCompleted function.
           */
          if(me.interpreter.step() === false && me.interpreter.robotInstructions.length === 0) {
            me.execution.finish();
            me.execution.onCompleted();
            break;
          }
        }
      }
      if(me.interpreter.robotInstructions.length > 0) {
        /* If it's not paused and we have instructions to execute, excecute them */
        if(me.interpreter.robotInstructions.length > 0 && !me.execution.isPaused()) {
          switch(me.interpreter.robotInstructions[0].action) {
            case 'motor':
              // console.log("Is in move");
              var duration = me.interpreter.robotInstructions[0].duration;
              var leftWheel = me.interpreter.robotInstructions[0].leftWheel;
              var rightWheel = me.interpreter.robotInstructions[0].rightWheel;

              this.moveRobot(leftWheel, rightWheel, dt / 1000);
              break;
          }

          me.interpreter.robotInstructions[0].duration -= dt / 1000;
          // console.log("Updates duration: " + me.interpreter.robotInstructions[0].duration);
          if(me.interpreter.robotInstructions[0].duration <= 0) {
            me.interpreter.robotInstructions.shift();
          }
        }
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
  onCollision : function (response) {
    this.pos.sub(response.overlapV);

    // Make all other objects solid
    return true;
  }
});
