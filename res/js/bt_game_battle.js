"use strict";

    /* =====================================================================================================================
     *  Binary tactics: 'Battle view' game functionalities
     * ================================================================================================================== */


// Initialize battle view
// ---------------------------------------------------------------------------------------------------------------------
bt.config.views.addView('battle',   {
                                        id : 'bt.game.battle',
                                        name : 'Battle',
                                        url : 'res/partials/views/battle.html',
                                        depth : 2,
                                        isPublic : false,
                                        onLoad : function() { bt.game.battle.view.onLoad(); },
                                        onUnload : function() { bt.game.battle.view.onUnload(); }
                                    }, false, true);


// Services
// ---------------------------------------------------------------------------------------------------------------------

// Battle service
/*
        Console call syntax example:
    
            bt.services.execute('BattleService', function(service) {
                                                    service.calls.getUsername(
                                                                        function(data) { console.log("Success:"); console.log(data); },
                                                                        function(data) { console.log("Fail:"); console.log(data); }
                                                                    );
                                                }, true);
*/
bt.services.battleService = app.factory('BattleService', function ($jsonRpc, $interval) {

    // Initialize battle service mappings
    var battleService = { };

    // Map service calls
    $jsonRpc.setup( { 'url': bt.config.urls.servicesUrl } );
    battleService.calls = {
                // Get username method
                getUsername :   $jsonRpc.method('get_username'),
                // Time left method
                timeLeft :      $jsonRpc.method('time_left'),
                // Initial state method
                initialState :  $jsonRpc.method('initial_state'),
                // Last result method
                lastResult :    $jsonRpc.method('last_result'),
                // Get states method
                getStates :     $jsonRpc.method('get_states'),
                // Get last state method
                getLastState :  $jsonRpc.method('get_last_state'),
                // Process action method
                processAction : $jsonRpc.method('process_action')
            };

    // Map service monitoring methods
    battleService.monitoring = {
        // Starts continuous monitoring of service
        monitorTimeLeft : function() {
            $interval.set('battleService.timers.update', function() { bt.game.battle.timers.update(battleService); }, 1000);
            $interval.start('battleService.timers.update');
            $interval.set('battleService.states.lastState', function() { bt.game.battle.battleField.update(battleService); }, bt.config.poling.battle.lastStateRefreshInterval);
            $interval.start('battleService.states.lastState');
        },
        // Stops continuous monitoring of service
        stopMonitoring : function() {
            $interval.clear('battleService.timers.update');
            $interval.clear('battleService.states.lastState');
        }
    };

    // Map service initialization methods
    battleService.initialization = {
        // Gets initial state from service
        initialize : function() {
            battleService.calls.initialState(
                                                // Parameters
                                                [],
                                                // On successfull load callback
                                                function(data) {
                                                    // Fire events
                                                    bt.services.battleService.Called.dispatch({ message: 'Response from "BattleService.init_state().', data : data });
                                                    bt.services.battleService.BattleFieldInitialized.dispatch({ message: 'Response from "BattleService.init_state().', data : data });
                                                    bt.services.battleService.BattleFieldUpdated.dispatch({ message: 'Response from "BattleService.init_state().', data : data });
                                                    // Initialize view-model's battleField from response
                                                    bt.game.battle.model.battleField = new bt.model.definitions.battle.battleField(data);
                                                    // Get last state
                                                    bt.game.battle.battleField.update(battleService);
                                                },
                                                // On error callback
                                                function(data) {
                                                    // Fire events
                                                    bt.services.battleService.Error.dispatch({ message: 'Error calling "BattleService.init_state()"!', data : data });
                                                }
            );
        },
        // Destroys model gotten from service
        destroy : function() {
            delete bt.game.battle.model.battleField;
        }
    };

    // Map service unit actions methods
    battleService.actions = {
        // Passes turn to other player
        pass: function () {
            battleService.calls.processAction(
                // Parameters
                [
                    [ 0, 'pass', [] ]
                ],
                // On successfull load callback
                function (data) {
                    // Fire events
                    bt.services.battleService.Called.dispatch({ message: 'Response from "BattleService.process_action().', data: data });
                    bt.services.battleService.BattleFieldAction_Pass.dispatch({ message: 'Response from "BattleService.process_action().', data: data });
                    // Refresh timers
                    bt.game.battle.timers.query(battleService);
                },
                // On error callback
                function (data) {
                    // Fire events
                    bt.services.battleService.Error.dispatch({ message: 'Error calling "BattleService.process_action()"!', data: data });
                    // TODO: Remove alert!
                    alert(data);
                }
            )
        },
        // Moves unit ( unit object | unit id) to new location ( {x, y} )
        move: function (unit, targetLocation) {
            var unitId = (angular.isNumber(unit) ? unit : unit.id);
            battleService.calls.processAction(
                // Parameters
                [
                    [ unitId, 'move', [targetLocation.x, targetLocation.y] ]
                ],
                // On successfull load callback
                function (data) {
                    // Fire events
                    bt.services.battleService.Called.dispatch({ message: 'Response from "BattleService.process_action().', data: data });
                    bt.services.battleService.BattleFieldAction_Move.dispatch({ message: 'Response from "BattleService.process_action().', data: data });
                    // Refresh timers
                    bt.game.battle.timers.query(battleService);
                    // Process move response
                    bt.game.battle.battleField.actions._processMove(data);
                },
                // On error callback
                function (data) {
                    // Fire events
                    bt.services.battleService.Error.dispatch({ message: 'Error calling "BattleService.process_action()"!', data: data });
                    // TODO: Remove alert!
                    alert(data);
                }
            )
        },
        // Attacks unit ( unit object | unit id) at location ( {x, y} )
        attack: function (unit, targetLocation) {
            var unitId = (angular.isNumber(unit) ? unit : unit.id);
            battleService.calls.processAction(
                // Parameters
                [
                    [ unitId, 'attack', [targetLocation.x, targetLocation.y] ]
                ],
                // On successfull load callback
                function (data) {
                    // Fire events
                    bt.services.battleService.Called.dispatch({ message: 'Response from "BattleService.process_action().', data: data });
                    bt.services.battleService.BattleFieldAction_Attack.dispatch({ message: 'Response from "BattleService.process_action().', data: data });
                    // Refresh timers
                    bt.game.battle.timers.query(battleService);
                    // Process move response
                    bt.game.battle.battleField.actions._processAttack(data);
                },
                // On error callback
                function (data) {
                    // Fire events
                    bt.services.battleService.Error.dispatch({ message: 'Error calling "BattleService.process_action()"!', data: data });
                    // TODO: Remove alert!
                    alert(data);
                }
            )
        }
    };

    // Return service mapping
    return battleService;
});


// Custom events definitions
// ---------------------------------------------------------------------------------------------------------------------

// @ bt.services.battleService

// "Service call successfull" event
bt.events.define(bt.services.battleService, 'Called');
// "Service call error" event
bt.events.define(bt.services.battleService, 'Error');
// "Service call successfull" event
bt.events.define(bt.services.battleService, 'Updated');

// "Battle field play timer reset" event
bt.events.define(bt.services.battleService, 'BattleField_PlayTimerReset');
// "Battle field new turn" event
bt.events.define(bt.services.battleService, 'BattleField_NewTurn');
// "Battle field new action" event
bt.events.define(bt.services.battleService, 'BattleField_NewAction');
// "Battle field game over" event
bt.events.define(bt.services.battleService, 'BattleField_GameOver');

// "Battle field initialized" event
bt.events.define(bt.services.battleService, 'BattleFieldInitialized');
// "Battle field updated" event
bt.events.define(bt.services.battleService, 'BattleFieldUpdated');
// "Battle field pass action" event
bt.events.define(bt.services.battleService, 'BattleFieldAction_Pass');
// "Battle field move action" event
bt.events.define(bt.services.battleService, 'BattleFieldAction_Move');
// "Battle field attack action" event
bt.events.define(bt.services.battleService, 'BattleFieldAction_Attack');

// Initialize 'battle view' game functionality
// ---------------------------------------------------------------------------------------------------------------------
bt.game.battle = {
    
    // Battle view, angular references namespace
    ng : {
        
        // Reference to 'game common' controller
        controller : app.controller('bt.game.battle.ng.controller', function($scope, BattleService) {
                // Set controller name (for scope detection/testing)
                $scope.controllerName = "bt.game.battle.ng.controller";
                // Set reference to app namespace
                $scope.bt = bt;
                // Set reference to services
                $scope.services = {
                    battle : BattleService
                };
                // Set battle field actions
                $scope.processAction =  function(tile) { bt.game.battle.model.battleField.grid.processTileClick (BattleService, tile); };
                $scope.passTurn =  function() { bt.game.battle.battleField.actions.pass(BattleService); };
            }).controller
        
    },
    
    // View manipulation namespace
    view : {
        // On view load
        // TODO: Set interval inside Angular context
        onLoad : function() {
                    bt.services.execute('BattleService', function(service) {
                        // Start Battle service monitoring
                        service.monitoring.monitorTimeLeft();
                        // Initialize model-view
                        service.initialization.initialize();
                    }, false);
            },
        // On view unload
        // TODO: Set interval inside Angular context
        onUnload : function() {
                    bt.services.execute('BattleService', function(service) {
                        // Stop Battle service monitoring
                        service.monitoring.stopMonitoring();
                        // Destroy model-view
                        service.initialization.destroy();
                    }, false);
            }
    },
    
    // Battle timers namespace
    timers : {
        
        // Holds refreshing interval reference
        _interval : null,
        
        // Holds time of last timers query with battle service
        _lastQueryTime : null,
        // Holds last queryed remaining battle time
        _battleTime : null,
        // Holds last queryed remaining play (turn) time
        _playTime : null,
        
        // Holds remaining battle time
        battleTimeFormated : null,
        battleTime : null,
        // Holds remaining play (turn) time
        playTimeFormated : null,
        playTime : null,

        // Parses server timer format to milliseconds
        _parseServerTime : function(time) {
            var parsed = time.split(':');
            return  ((parseFloat(parsed[0]) * 3600) + (parseFloat(parsed[1]) * 60) + parseFloat(parsed[2]));
        },

        // Updates timers based on last queryed values (calls query if no values)
        update : function(battleService) {
            // Check for last queryed values
            if (!bt.game.battle.timers._lastQueryTime) {
                // Query values
                bt.game.battle.timers.query(battleService);
            } else {
                // Recalculate values
                var diff = (new Date()) - bt.game.battle.timers._lastQueryTime;
                var battleTime = bt.game.battle.timers._battleTime - (diff / 1000);
                if (battleTime < 0) battleTime = 0;
                bt.game.battle.timers.battleTime = battleTime;
                bt.game.battle.timers.battleTimeFormated = Math.floor(battleTime / 3600) + ' : ' + Math.floor((battleTime % 3600) / 60) + ' : ' + Math.floor(battleTime % 60);
                var playTime = bt.game.battle.timers._playTime - (diff / 1000);
                if (playTime < 0) playTime = 0;
                bt.game.battle.timers.playTime = playTime;
                bt.game.battle.timers.playTimeFormated = Math.floor(playTime / 3600) + ' : ' + Math.floor((playTime % 3600) / 60) + ' : ' + Math.floor(playTime % 60);
                // Check values
                if ((battleTime <= 0) || (playTime <= 0)) {
                    // Query values
                    bt.game.battle.timers.query(battleService);
                }
            }
        },

        // Querys timers with battle service
        query : function(battleService) {
            // Check time since last query
            if ((new Date() - bt.game.battle.timers._lastQueryTime) > bt.config.poling.minimalIntervalBetweenPolls) {
                // Query timers from service
                battleService.calls.timeLeft(   // Parameters
                                                [],
                                                // Success callback
                                                function(data) {
                                                        // Set data
                                                        if ((data) && (data.battle) && (data.ply)) {
                                                            bt.game.battle.timers._battleTime = bt.game.battle.timers._parseServerTime(data.battle);
                                                            if ((bt.game.battle.timers._parseServerTime(data.ply) > bt.game.battle.timers.playTime) && (bt.game.battle.timers.playTime !== null)) {
                                                                bt.services.battleService.BattleField_PlayTimerReset.dispatch({ message: 'Play time reset!', data : data });
                                                            }
                                                            bt.game.battle.timers._playTime = bt.game.battle.timers._parseServerTime(data.ply);
                                                            bt.game.battle.timers._lastQueryTime = new Date();
                                                            // Fire events
                                                            bt.services.battleService.Called.dispatch({ message: 'Response from "BattleService.timeLeft()".', data : data });
                                                            bt.services.battleService.Updated.dispatch({ message: 'Updated "BattleService" timers' });
                                                            // Update timers
                                                            bt.game.battle.timers.update();
                                                        } else {
                                                            // Fire event
                                                            bt.services.battleService.Error.dispatch({ message: 'Error calling "BattleService.timeLeft()"!', data : data });
                                                        }
                                                    },
                                                // Fail callback
                                                function(data) {
                                                        // Fire event
                                                        bt.services.battleService.Error.dispatch({ message: 'Error calling "BattleService.timeLeft()"!', data : data });
                                                    }
                                            );
            }
        }

    },

    // Battle field namespace
    battleField : {

        // Actions namespace
        actions : {
            // Performs pass action
            pass : function(battleService) {
                // Fire 'pass turn' event
                var results = bt.game.battle.battleField.PassTurn.dispatch();
                // Check event handlers' results
                if ((results === null) || (results.false == 0)) {
                    // Execute turn pass
                    battleService.actions.pass();
                    // Fire 'passed turn' event
                    bt.game.battle.battleField.PassedTurn.dispatch();
                }
            },

            // Performs move action
            move : function(battleService, unit, tile) {
                battleService.actions.move(unit, tile.location);
            },
            // Processes successfull move action's response
            _processMove : function(data) {
                var units = data.response.result;
                for (var i in units) {
                    var unit = bt.game.battle.model.battleField.units.unitsById[units[i][0]];
                    var location = units[i][1];
                    if (unit) {
                        // Move unit
                        bt.game.battle.model.battleField.grid.moveContent(unit, { x : location[0], y : location[1] });
                        // Select unit
                        bt.game.battle.model.battleField.grid._selectTile(bt.game.battle.model.battleField.grid.tilesByX[location[0]][location[1]]);
                    }
                }
            },

            // Performs attack action
            attack : function(battleService, unit, tile) {
                battleService.actions.attack(unit, tile.location);
            },
            // Processes successfull attack action's response
            _processAttack : function(data) {
                var units = data.response.result;
                for (var i in units) {
                    var unit = bt.game.battle.model.battleField.units.unitsById[units[i][0]];
                    var hp = unit.hp - units[i][1];
                    if (unit) unit.updateHp(hp);
                }
            }
        },

        // Updates battle field state
        update : function(battleService) {
            // Call 'BattleField.last_state()'
            battleService.calls.getLastState(   // Parameters
                                                [],
                                                // Success callback
                                                function(data) {
                                                    if ((data) && (bt.game.battle.model.battleField)) {
                                                        // Process update response
                                                        bt.game.battle.battleField._processUpdate(data);
                                                        // Fire events
                                                        bt.services.battleService.Called.dispatch({ message: 'Response from "BattleService.last_state()".', data : data });
                                                        bt.services.battleService.Updated.dispatch({ message: 'Updated "BattleService" state', data : data });
                                                    }
                                                },
                                                // Fail callback
                                                function(data) {
                                                    // Fire event
                                                    bt.services.battleService.Error.dispatch({ message: 'Error calling "BattleService.last_state()"!', data : data });
                                                }
                                            );
        },
        _processUpdate : function(data) {
            // Update location
            if (data.locs) for (var id in data.locs) {
                var unit = bt.game.battle.model.battleField.units.unitsById[id];
                if (unit) bt.game.battle.model.battleField.grid.moveContent(unit, { x : data.locs[id][0], y : data.locs[id][1] });
            }
            // Update HP
            if (data.HPs) for (var id in bt.game.battle.model.battleField.units.unitsById) {
                // Get unit
                var unit = bt.game.battle.model.battleField.units.unitsById[id];
                // Check if unit updated
                if (data.HPs[id]) {
                    // Check damage
                    if (unit) unit.updateHp(data.HPs[id]);
                } else {
                    // Unit dead
                    if (unit) unit.updateHp(0);
                }
            }
            // Update game status
            if (data.num) {
                if (Math.floor(data.num / 2) != bt.game.battle.model.battleField.turnNumber) {
                    bt.game.battle.model.battleField.turnNumber = Math.floor(data.num / 2);
                    if (data.whose_action) bt.game.battle.model.battleField.activePlayer = bt.game.battle.model.battleField.players[( bt.game.battle.model.battleField.turnNumber % bt.game.battle.model.battleField.players.length )];
                    bt.services.battleService.BattleField_NewTurn.dispatch({ message: 'New turn!', data : data });
                }
                if ((data.num % 2) + 1 != bt.game.battle.model.battleField.actionNumber) {
                    bt.game.battle.model.battleField.actionNumber = (data.num % 2) + 1;
                    bt.services.battleService.BattleField_NewAction.dispatch({ message: 'New action!', data : data });
                }
            }
            // Check if game over
            if (data.game_over === true) {
                // Set game over status
                bt.game.battle.model.battleField.gameOver = data.game_over;
                // Announce game over
                bt.services.battleService.BattleField_GameOver.dispatch({ message: 'Game over!', data : data });
                // Reload view
                if (bt.config.views._currentView.name == 'Battle') {
                    // Reload battle field
                    bt.config.views._currentView.onUnload();
                    bt.config.views._currentView.onLoad();
                }
            }

        }

    }

}


// Initialize 'battle view' model-view
// ---------------------------------------------------------------------------------------------------------------------
bt.game.battle.model = {

    // Holds reference to battle view's battleField model
    battleField : null

}


// Custom events definitions
// ---------------------------------------------------------------------------------------------------------------------

// @ bt.game.battle.model.battleField

// "Pass turn" event
bt.events.define(bt.game.battle.battleField, 'PassTurn');
// "Passed turn" event
bt.events.define(bt.game.battle.battleField, 'PassedTurn');


// DEBUGGING: TODO Remove debugging functinoality
// ---------------------------------------------------------------------------------------------------------------------

// Refresh battle field on authentication successfull
bt.services.authenticationService.AuthenticationSuccessfull.subscribe(function() {
    // Check if battleview selected
    if (bt.config.views._currentView.name == 'Battle') {
        // Reload battle field
        bt.config.views._currentView.onUnload();
        bt.config.views._currentView.onLoad();
    }
});