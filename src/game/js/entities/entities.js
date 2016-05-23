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

    /* Get current level */
    var currentLevel = me.levelDirector.getCurrentLevel();

    /* Get current level width and height*/
    this.currentLevelWidth = (currentLevel.cols * currentLevel.tilewidth);
    this.currentLevelHeight = (currentLevel.rows * currentLevel.tileheight);

    this.tracer = {
      enabled : false,
      colour: '#000000'
    };

    /* Creating the tracer canvas to draw the robot's movements */
    this.traceCanvas = me.video.createCanvas(this.currentLevelWidth, this.currentLevelHeight, true);
    this.traceCanvas.getContext("2d").clearRect(0, 0, this.currentLevelWidth, this.currentLevelHeight);
    this.traceRenderer = new me.CanvasRenderer(this.traceCanvas, me.game.viewport.width, me.game.viewport.height);
    this.traceRenderer.setColor("#000000");

    /* Set the display to follow our position on both axis (in case the map is too big) */
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

    /* Ensure the player is updated even when outside of the viewport */
    this.alwaysUpdate = true;
 
    /* Defines the standing animation (using the first frame) */
    this.renderable.addAnimation("unique",  [0]);

    /* Set the unique animation to be rendered */
    this.renderable.setCurrentAnimation("unique");

    /* Defines the map limits */
    this.maxX = this.currentLevelWidth - (this.width / 2) - 0.1;
    this.maxY = this.currentLevelHeight - (this.height / 2) - 0.1;
    this.minX = this.width / 2;
    this.minY = this.height / 2;

    /* Range of detection */
    this.sensorRange = 50;

    this.sensors = {
      front: this.sensorRange,
      left: this.sensorRange,
      right: this.sensorRange
    };

    /* As our robot is round, make its shape to be an ellipse */
    this.body.shapes[0] = new me.Ellipse(0, 0, this.width, this.width);

    /* Shapes for the sensors */
    this.body.shapes[1] = new me.Line(0, this.width / 2, 
      [new me.Vector2d(0,0), new me.Vector2d(0, this.sensorRange)]);
    this.body.shapes[2] = new me.Line(0, - this.width / 2, 
      [new me.Vector2d(0,0), new me.Vector2d(0, - this.sensorRange)]);
    this.body.shapes[3] = new me.Line(this.width / 2, 0, 
      [new me.Vector2d(0,0), new me.Vector2d(this.sensorRange, 0)]);
    this.body.shapes[4] = new me.Line(- this.width / 2, 0, 
      [new me.Vector2d(0,0), new me.Vector2d(- this.sensorRange, 0)]);
    this.body.updateBounds();

    /* Distance between the center of the two wheels, 30 pixels */
    this.l = 30;
    this.wheelRadious = 5;
  },

  /* http://planning.cs.uiuc.edu/node659.html */
  moveRobot : function(leftMotor, rightMotor, time) {    
    leftMotor *= time;
    rightMotor *= time;
    var deltaAngle = (this.wheelRadious/this.l) * (rightMotor - leftMotor);
    this.pos.x = this.pos.x + (this.wheelRadious/2)*(leftMotor + rightMotor)*Math.cos(this.renderable.angle);
    this.pos.y = this.pos.y + (this.wheelRadious/2)*(leftMotor + rightMotor)*Math.sin(this.renderable.angle);
    this.renderable.angle += deltaAngle;

    for(i=1; i<this.body.shapes.length; i++) {
      this.body.shapes[i].rotate(deltaAngle);
      old_x = this.body.shapes[i].pos.x;
      old_y = this.body.shapes[i].pos.y;
      this.body.shapes[i].pos.x = Math.cos(deltaAngle) * (old_x-0) - Math.sin(deltaAngle) * (old_y-0) + 0;
      this.body.shapes[i].pos.y = Math.sin(deltaAngle) * (old_x-0) + Math.cos(deltaAngle) * (old_y-0) + 0;
    }
  },

  /* Extends draw function to draw the tracing */
  draw: function(renderer) {
    if(this.tracer.enabled)
      this.traceRenderer.fillArc(this.pos.x, this.pos.y - 6, 6, 0, 2*Math.PI);
    renderer.drawImage(this.traceCanvas, 0, 0);

    this._super(me.Entity, 'draw', [renderer]);
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
          var instruction = me.interpreter.robotInstructions[0];
          switch(instruction.action) {
            case 'motor':
              var duration = instruction.duration;
              var leftWheel = instruction.leftWheel;
              var rightWheel = instruction.rightWheel;

              this.moveRobot(leftWheel, rightWheel, dt / 1000);

              instruction.duration -= dt / 1000;
              if(instruction.duration <= 0) {
                me.interpreter.robotInstructions.shift();
              }

              break;
            case 'tracer_status':
              this.tracer.enabled = instruction.enabled.data;
              me.interpreter.robotInstructions.shift();
              break;
            case 'tracer_colour':
              this.tracer.colour = instruction.colour.data;
              this.traceRenderer.setColor(this.tracer.colour);
              me.interpreter.robotInstructions.shift();
              break;
            case 'sensor':
              instruction.sensorResultCallback(
                me.interpreter.createPrimitive(this.sensors[instruction.sensorName.data]));
              me.interpreter.robotInstructions.shift();
              break;
          }
        }
      }


    }

    /* Sensor's settings */
    this.sensors.left = this.sensorRange;
    this.sensors.right = this.sensorRange;
    this.sensors.front = this.sensorRange;

    /* Limits checking */
    if(this.pos.x <= this.minX) {
      this.pos.x = this.minX + 1;
    }
    else if(this.pos.x >= this.maxX) {
      this.pos.x = this.maxX;
    }

    if(this.pos.y <= this.minY) {
      this.pos.y = this.minY + 1;
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
     /* If the colliding shape belongs to the robot, do a normal collision */
     if(response.indexShapeA === 0 || typeof response.indexShapeA === "undefined") {
       this.pos.sub(response.overlapV);
       return true;
     }

     /* Create a copy of the sensor's range line and positionate it into the level */
     var myLine = me.pool.pull("line", 
       response.a.body.shapes[response.indexShapeA].pos.x + response.a.pos.x, 
       response.a.body.shapes[response.indexShapeA].pos.y + response.a.pos.y,
        [response.a.body.shapes[response.indexShapeA].points[0], 
        response.a.body.shapes[response.indexShapeA].points[1]]);

     /* Get a copy of the line's starting point */
     var startPoint = me.pool.pull("vector", myLine.pos.x, myLine.pos.y);

     /* Get all edges of the entity beeing touched by the sensor line */
     var edges = response.b.getBodyEdgesAsLines();

     /* 
       Calculate the minium distance between the starting point and 
       the point of intersection between the sensor line and the entity
       edges. 
     */
     var minDistance = Number.MAX_SAFE_INTEGER;
     for (var i = 0; i < edges.length; i++) {
       var intersect = myLine.intersection(edges[i]);
       me.pool.push(edges[i]);
       if(intersect !== null) {
         var distance = Math.round(startPoint.distance(intersect));
         if(distance < minDistance)
           minDistance = distance;
         me.pool.push(intersect);
       }
     }

     /* Set the sensor's values */
     switch(response.indexShapeA) {
       case 1:
          response.a.sensors.right = minDistance;
          break;
       case 2:
          response.a.sensors.left = minDistance;
          break;
       case 3:
          response.a.sensors.front = minDistance;
          break;
     }

     /* Return elements to the pool */
     me.pool.push(myLine);
     me.pool.push(startPoint);

     return false;
   }
});

game.WorldFrameEntity = me.Entity.extend({
  init: function() {
    settings = {
      name : "wordEntity",
      // image : "",
      width : me.game.viewport.width,
      height : me.game.viewport.height
    };
    this._super(me.Entity, 'init', [0, 0, settings]);

    var actualMap = me.levelDirector.getCurrentLevel();

    this.mapWidth = actualMap.cols * actualMap.tilewidth;
    this.mapHeight = actualMap.rows * actualMap.tileheight;

      /* Top line */
    this.body.shapes[0] = new me.Line(0, 0, [new me.Vector2d(0, 0), 
      new me.Vector2d(this.mapWidth, 0)]);
    /* Left line */
    this.body.shapes[1] = new me.Line(0, 0, [new me.Vector2d(0, 0), 
      new me.Vector2d(0, this.mapHeight)]);
    /* Right line */
    this.body.shapes[1] = new me.Line(0, 0, [new me.Vector2d(this.mapWidth, 0), 
      new me.Vector2d(this.mapWidth, this.mapHeight)]);
    /* Bottom line */
    this.body.shapes[2] = new me.Line(0, 0, [new me.Vector2d(0, this.mapHeight), 
      new me.Vector2d(this.mapWidth, this.mapHeight)]);
    this.body.updateBounds();
  }

});