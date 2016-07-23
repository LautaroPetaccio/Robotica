game.PlayScreen = me.ScreenObject.extend({
  onResetEvent: function() {
    /* Load level */
    me.levelDirector.loadLevel(me.game.map);

    var robotEntity = me.game.world.getChildByProp("name", "robot")[0];

    /* Add the world entity */
    me.game.world.addChild(me.pool.pull("worldEntity"));

    /* Add the HUD */
    if(me.game.HUD.enabled) {
      me.game.HUD.HUDContainer = me.pool.pull("HUDContainer", robotEntity);
      me.game.world.addChild(me.game.HUD.HUDContainer);
    }
  },

    /**
     * Action to perform when leaving this screen (state change)
     */
  onDestroyEvent: function() {
  }
});
