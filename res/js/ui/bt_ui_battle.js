"use strict";

/* =====================================================================================================================
 *  Binary tactics: Battle view's UI functionalities
 * ================================================================================================================== */


// Battle view's UI and animation event handlers
// ---------------------------------------------------------------------------------------------------------------------

// Handles 'new turn' event
bt.services.battleService.BattleField_NewTurn.subscribe(function() {
    // Deselect selected unit
    bt.game.battle.model.battleField.grid._selectTile(null);
    // Push to log
    bt.game.battle.ui.log.addMessage('timer', bt.game.battle.model.battleField.activePlayer + '\'s turn!');
    // Animate dnew turn notification
    bt.game.battle.ui.animations.animateTurn();
});

// Handles 'new action' event
bt.services.battleService.BattleField_NewAction.subscribe(function() { });

// Handles 'game over' event
bt.services.battleService.BattleField_GameOver.subscribe( function() { });

// Validates 'tile select' event
bt.game.battle.battleField.PassTurn.subscribe(function() {
    // Allow if not player's turn
    if (bt.game.battle.model.battleField.activePlayer == bt.game.authentication.username) {
        return true;
    } else {
        // Prompt wrong selection
        alert("It's not your turn!");
        return false;
    }
});


// Validates 'tile select' event
bt.game.battle.battleField.TileSelect.subscribe(function(tile) {
    // Allow if not player's turn, if first action of turn or if no unit selected
    if ((!bt.game.battle.model.battleField.grid.selectedTile) || (bt.game.battle.model.battleField.activePlayer != bt.game.authentication.username) || (bt.game.battle.model.battleField.actionNumber == 1)) {
        return true;
    } else {
        // Prompt wrong selection
        alert("You can only use one unit per turn!");
        return false;
    }
});

// Validates 'tile deselect' event
bt.game.battle.battleField.TileDeselect.subscribe(function(tile) {
    // Allow if not player's turn or if first action of turn
    if ((bt.game.battle.model.battleField.activePlayer != bt.game.authentication.username) || (bt.game.battle.model.battleField.actionNumber == 1)) {
        return true;
    } else {
        // Prompt wrong selection
        alert("You can only use one unit per turn!");
        return false;
    }
});

// Validates 'tile execute action' event
bt.game.battle.battleField.TileActionExecute.subscribe(function(tile) {
    // Allow if player's turn
    if (bt.game.battle.model.battleField.activePlayer == bt.game.authentication.username) {
        return true;
    } else {
        // Prompt wrong selection
        alert("It's not your turn!");
        return false;
    }
});

// Prompts user on 'repeated action' event
bt.game.battle.battleField.RepeatAction.subscribe(function() {
    alert('It\'s forbiden to repeat an action within a turn!');
});


// Prompts user on 'unit damage' event
bt.game.battle.battleField.UnitDamage.subscribe(function(event) {
    if (event.unit.hp) {
        // Animate damage
        bt.game.battle.ui.animations.animateDamage(event.unit, event.hp);
        // Push to log
        bt.game.battle.ui.log.addMessage('combat', 'Unit "' + event.unit.name + '" takes ' + (event.unit.hp - event.hp) + ' damage!');
    }
});
// Prompts user on 'unit dead' event
bt.game.battle.battleField.UnitDead.subscribe(function(event) {
    if (event.unit.hp) {
        // Animate damage
        bt.game.battle.ui.animations.animateDamage(event.unit, event.hp);
        // Push to log
        bt.game.battle.ui.log.addMessage('combat', 'Unit "' + event.unit.name + '" takes ' + (event.unit.hp - event.hp) + ' damage and dies!');
    }
});


// Battle view's animations
// ---------------------------------------------------------------------------------------------------------------------

// Battle view's UI namespace
bt.game.battle.ui = {

    // Animations namespace
    animations : {

        // Animates damage on unit
        animateDamage : function(unit, hp) {
            // Initialize damage animation (Using CSS3 class name change transition)
            unit._animation = {
                _damage : unit._damage,
                initDamage : function(unit, amount) {
                    unit._damage.has = false;
                    unit._damage.amount = amount;
                    setTimeout(this.showDamage, 60, this, unit);
                },
                showDamage : function(animation, unit) {
                    unit._damage.has = true;
                    setTimeout(animation.hideDamage, bt.config.game.battle.styles.damegeNotificationTimeout, this, unit);
                },
                hideDamage : function(animation, unit) {
                    unit._damage.has = false;
                }
            }
            // Start animation
            unit._animation.initDamage(unit, (unit.hp - hp));
        },

        // Animates new turn notification
        animateTurn : function() {
            // Set notification
            bt.game.battle.ui._newTurnNotification = true;
            // Hide notification after timeout
            setTimeout(function() { bt.game.battle.ui._newTurnNotification = false; }, 1000);
        },
        // Holds 'new turn' notification status
        _newTurnNotification : false

    },

    // Holds battle UI displayed log
    log : {

        // Holds log messages
        messages : [],

        // Log message class
        _message : function(style, message) {
            // Set message's time
            this.time = new Date();
            this.time = this.time.getHours() + ':' + this.time.getMinutes() + ':' + this.time.getSeconds();
            // Set message's style
            this.style = style;
            // Set message's contents
            this.message = message;
        },

        // Adds a message to log
        addMessage : function(style, message) {
            bt.game.battle.ui.log.messages.splice(0, 0,  new bt.game.battle.ui.log._message(style, message));
        }

    }

}