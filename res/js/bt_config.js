"use strict";

    /* =====================================================================================================================
     *  Binary tactics: Configuration
     * ================================================================================================================== */



// Configuration namespace
// ---------------------------------------------------------------------------------------------------------------------

// Holds root path of URL where application is deployed
bt.config.urls = {
    clientUrl :     '/battle/static/btjs2/',
    servicesUrl :   '/battle/'
}

// Set poling
bt.config.poling.minimalIntervalBetweenPolls = 2000;

// Set debugging options
bt.debugging.events.publishToConsole = false;
bt.debugging.model.verifyModelConstructors = true;

// BattleField configuration namespace
// ---------------------------------------------------------------------------------------------------------------------

bt.config.game.battle.styles.selected = 'tile_selected';
bt.config.game.battle.styles.move_near = 'tile_move_near';
bt.config.game.battle.styles.move_far = 'tile_move_far';
bt.config.game.battle.styles.attack = 'tile_attack';
