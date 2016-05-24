game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        // reset the score
        game.data.score = 0;

        // load a level
        me.levelDirector.loadLevel("area03");
        
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
