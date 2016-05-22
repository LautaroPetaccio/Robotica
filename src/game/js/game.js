
/* Game namespace */
var game = {

  // an object where to store game information
  parser : null,

  data : {
    // score
    score: 0,
  },


  // Run on page load.

  "onload" : function (canvasWrapper) {
    /* 
      0 => running
      1 => paused
      2 => finished
    */
    me.execution = {
      state : 2,
      pause : function() { this.state = 1; },
      run : function() { this.state = 0; },
      finish : function() { this.state = 2; },
      isPaused : function() { return this.state == 1; },
      hasFinished : function() { return this.state == 2; },
    };

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
    me.audio.init("mp3,ogg");

    // Set a callback to run when loading is complete.
    me.loader.onload = this.loaded.bind(this);

    // Load the resources.
    me.loader.preload(game.resources);

    // Initialize melonJS and display a loading screen.
    me.state.change(me.state.LOADING);
  },

  // Run on game resources loaded.
  "loaded" : function () {
    me.state.set(me.state.MENU, new game.TitleScreen());
    me.state.set(me.state.PLAY, new game.PlayScreen());

    // add our player entity in the entity pool
    me.pool.register("mainPlayer", game.PlayerEntity);

    me.pool.register("worldEntity", game.WorldFrameEntity);
    me.pool.register("line", me.Line, true);
    me.pool.register("vector", me.Vector2d, true);

    // Start the game.
    me.state.change(me.state.PLAY);
  }
};
