game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        // load a level
        me.levelDirector.loadLevel(me.game.map);
        
        /* Add the world entity */
        me.game.world.addChild(me.pool.pull("worldEntity"));
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        /* Nothing */
    }
});
