"use strict";

    /* =====================================================================================================================
     *  Binary tactics: Configuration
     * ================================================================================================================== */



// Configuration namespace
// ---------------------------------------------------------------------------------------------------------------------

    // Configure root path of URL where application is deployed
    // -----------------------------------------------------------------------------------------------------------------
    bt.config.urls = {
        // Set client-side URL path
        clientUrl :     '/battle/static/btjs2/',
        // Set server-side URL path
        servicesUrl :   '/battle/'
    }

    // Set poling
    // -----------------------------------------------------------------------------------------------------------------

    // Set value for minimal time interval between polling same service in [ms]
    bt.config.poling.minimalIntervalBetweenPolls = 2000;

    // Set debugging options
    // -----------------------------------------------------------------------------------------------------------------

    // Set if events are pushed to console
    bt.debugging.events.publishToConsole = true;
    // Set if model constructors will test received properties
    bt.debugging.model.verifyModelConstructors = true;

// BattleField configuration namespace
// ---------------------------------------------------------------------------------------------------------------------

    // Set CSS Styles
    // -----------------------------------------------------------------------------------------------------------------

    // Selected tile CSS class name
    bt.config.game.battle.styles.selected = 'tile_selected';
    // Selected tile CSS class name
    bt.config.game.battle.styles.move = 'tile_move';
    // Selected tile CSS class name
    bt.config.game.battle.styles.range = 'tile_range';
    // Selected tile CSS class name
    bt.config.game.battle.styles.attack = 'tile_attack';

    // Player's unit CSS class name
    bt.config.game.battle.styles.player = 'unit_player';
    // Enemy unit CSS class name
    bt.config.game.battle.styles.enemy = 'unit_enemy';

    // Configure actions
    // -----------------------------------------------------------------------------------------------------------------

    // Set unit's move radius
    bt.config.game.battle.actions.moveRadius = 4;
    // Set if actions and movement can pass through other units
    bt.config.game.battle.actions.jumpUnits = true;
    // Set if player can attack his own units
    bt.config.game.battle.actions.friendlyFire = true;
