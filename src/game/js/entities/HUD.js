/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.Container.extend({
  init : function(robotEntity) {
    this._super(me.Container, 'init');
    /* Make sure we follow the viewport */
    this.floating = true;
    /* Make sure our object is always draw first */
    this.z = Infinity;
    this.name = "HUD";

    this.robotEntity = robotEntity;
    this.addChild(me.pool.pull("HUDBackground", 0, 0, me.game.viewport.width, 50));
    this.addChild(me.pool.pull("HUDRobotPosition", 10, 5, this.robotEntity.pos));
    this.addChild(me.pool.pull("HUDRobotSensors", 10, 25, this.robotEntity.sensors));
    this.addChild(me.pool.pull("HUDRobotShapes", this.robotEntity));
    }
});

game.HUD.RobotSensors = me.Renderable.extend({
  init : function(x, y, sensors) {
    this._super(me.Renderable, 'init', [x, y, 10, 10]);
    this.sensors = sensors;
    this.font = new me.Font("courier", 14, "white");
  },

  update : function () {
    return true;
  },

  draw : function (renderer) {
    this.font.draw(renderer, "Sensor izquierdo: " + this.sensors.left, 
      this.pos.x, 
      this.pos.y);

    this.font.draw(renderer, "Sensor derecho: " + this.sensors.right, 
      this.pos.x + 240, 
      this.pos.y);

    this.font.draw(renderer, "Sensor frontal: " + this.sensors.front, 
      this.pos.x + 460,
      this.pos.y);
  }
});


game.HUD.RobotPosition = me.Renderable.extend({
  init : function(x, y, robotPosition) {
    this._super(me.Renderable, 'init', [x, y, 10, 10]);
    this.robotPosition = robotPosition;
    this.localRobotPosition = { x : 0, y : 0 };
    this.font = new me.Font("courier", 14, "white");
  },

  update : function () {
    /* Update only if the position changed */
    if(this.robotPosition.x != this.localRobotPosition.x ||
      this.robotPosition.y != this.localRobotPosition.y) {
      this.localRobotPosition.x = Math.round(this.robotPosition.x);
      this.localRobotPosition.y = Math.round(this.robotPosition.y);
      return true;
    }
    return false;
  },

  draw : function (renderer) {
    var text = "Posición del robot: (" + this.localRobotPosition.x + ", " + this.localRobotPosition.y + ")";
    this.font.draw(renderer, text, this.pos.x + 2, this.pos.y);
  }
});

game.HUD.RobotShapes = me.Renderable.extend({
  init : function(robotEntity) {
    this._super(me.Renderable, 'init', [robotEntity.pos.x, robotEntity.pos.y, 10, 10]);
    this.localRobotPosition = { x : 0, y : 0, angle: 0.0 };
    this.robotEntity = robotEntity;
  },

  update : function() {

    /* Only update if the position or the angle changed */
    if(this.localRobotPosition.x != this.robotEntity.pos.x ||
      this.localRobotPosition.y != this.robotEntity.pos.y ||
      this.localRobotPosition.angle != this.robotEntity.renderable.angle) {
      this.localRobotPosition.x = this.robotEntity.pos.x;
      this.localRobotPosition.y = this.robotEntity.pos.y;
      this.localRobotPosition.angle = this.robotEntity.renderable.angle;
      return true;
    }
    return false;
  },

  draw : function(renderer) {
    renderer.save();
    renderer.setLineWidth(1.5);
    /* Draw all shapes */
    renderer.setColor("red");
    renderer.translate(this.localRobotPosition.x - me.game.viewport.pos.x, 
      this.localRobotPosition.y - me.game.viewport.pos.y);
    for (var i = this.robotEntity.body.shapes.length - 1, 
      shape; i--, (shape = this.robotEntity.body.shapes[i]);) {
      renderer.drawShape(shape);
    }
    renderer.restore();
  }

});

game.HUD.Background = me.Renderable.extend({
  init : function(x, y, width, height) {
      this._super(me.Renderable, 'init', [x, y, width, height]);
      this.width = width;
      this.height = height;
  },

  draw : function(renderer) {
      renderer.setGlobalAlpha(0.5);
      renderer.setColor("black");
      renderer.fillRect(
          this.pos.x,  this.pos.y,
          this.width, this.height
      );
      renderer.setGlobalAlpha(1);
  }
});
