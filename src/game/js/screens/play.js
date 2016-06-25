game.PlayScreen = me.ScreenObject.extend({
  onResetEvent: function() {
    /* Load level */
    me.levelDirector.loadLevel(me.game.map);

    var robotEntity = me.game.world.getChildByProp("name", "robot")[0];

    /* Add the world entity */
    me.game.world.addChild(me.pool.pull("worldEntity"));

    /* Add the HUD */
    // this.HUD = me.pool.pull("HUDContainer", robotEntity);
    // me.game.world.addChild(this.HUD);
  },

    /**
     * Action to perform when leaving this screen (state change)
     */
  onDestroyEvent: function() {
  }
});
