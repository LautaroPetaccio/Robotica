
/* Game namespace */
var game = {

  // Run on page load.

  "onload" : function (canvasWrapper) {
    /* 
      0 => running
      1 => paused
      2 => finished
    */
    me.execution = {
      state : 2,
      run : function() { this.state = 0; },
      pause : function() { this.state = 1; },
      finish : function() { this.state = 2; },
      isRunning : function() { return this.state == 0; },
      isPaused : function() { return this.state == 1; },
      hasFinished : function() { return this.state == 2; }
    };

    me.game.changeMap = function(mapName) {
      me.game.map = mapName;
      me.state.pause();
      me.state.change(me.state.PLAY);
      me.state.resume();
    }

    // Initialize the video.
    if (!me.video.init(640, 640, {wrapper : canvasWrapper, antiAlias: true})) {
      alert("Your browser does not support HTML5 canvas.");
      return;
    }

    if (me.game.HASH["debug"]) {
        window.onReady(function () {
            me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
        });
    }

    // Initialize the audio.
    // me.audio.init("mp3,ogg");

    // Set a callback to run when loading is complete.
    me.loader.onload = this.loaded.bind(this);

    // Load the resources.
    me.loader.preload(game.resources);

    // Initialize melonJS and display a loading screen.
    me.state.set(me.state.LOADING, new game.CustomLoadingScreen());
    me.state.change(me.state.LOADING);
  },

  // Run on game resources loaded.
  "loaded" : function () {
    /* Set the map to be loaded */
    me.game.map = "area03";

    me.state.set(me.state.PLAY, new game.PlayScreen());

    /* Add our player entity in the entity pool */
    me.pool.register("mainPlayer", game.PlayerEntity);

    /* HUD Container */
    me.pool.register("HUDContainer", game.HUD.Container, true);
    me.pool.register("HUDBackground", game.HUD.Background, true);
    me.pool.register("HUDRobotPosition", game.HUD.RobotPosition, true);
    me.pool.register("HUDRobotSensors", game.HUD.RobotSensors, true);
    me.pool.register("HUDRobotShapes", game.HUD.RobotShapes, true);


    me.pool.register("worldEntity", game.WorldFrameEntity);
    me.pool.register("line", me.Line, true);
    me.pool.register("vector", me.Vector2d, true);

    // Start the game.
    me.state.change(me.state.PLAY);
  }
};
