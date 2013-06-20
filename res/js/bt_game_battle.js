"use strict";

    /* =====================================================================================================================
     *  Binary tactics: 'Battle view' game functionalities
     * ================================================================================================================== */


// Initialize battle view
// ---------------------------------------------------------------------------------------------------------------------
bt.config.views.addView('battle',   {
                                        id : 'bt.game.battle',
                                        name : 'BATTLE',
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
                                                    service.getUsername(
                                                                        function(data) { console.log("Success:"); console.log(data); },
                                                                        function(data) { console.log("Fail:"); console.log(data); }
                                                                    );
                                                });
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
            $interval.set('battleService.states.lastState', function() { bt.game.battle.battleField.update(battleService); }, 4000);
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
        pass : function() {
            battleService.calls.processAction(
                // Parameters
                [[ 0, 'pass', [] ]],
                // On successfull load callback
                function(data) {
                    // Fire events
                    bt.services.battleService.Called.dispatch({ message: 'Response from "BattleService.process_action().', data : data });
                    bt.services.battleService.BattleFieldAction_Pass.dispatch({ message: 'Response from "BattleService.process_action().', data : data });
                    // Refresh timers
                    bt.game.battle.timers.query(battleService);
                },
                // On error callback
                function(data) {
                    // Fire events
                    bt.services.battleService.Error.dispatch({ message: 'Error calling "BattleService.process_action()"!', data : data });
                }
            )
        },
        // Moves unit ( unit object | unit id) to new location ( {x, y} )
        move : function(unit, targetLocation) {
            var unitId = (angular.isNumber(unit) ? unit : unit.id);
            battleService.calls.processAction(
                // Parameters
                [[ unitId, 'move', [targetLocation.x, targetLocation.y] ]],
                // On successfull load callback
                function(data) {
                    // Fire events
                    bt.services.battleService.Called.dispatch({ message: 'Response from "BattleService.process_action().', data : data });
                    bt.services.battleService.BattleFieldAction_Move.dispatch({ message: 'Response from "BattleService.process_action().', data : data });
                    // Refresh timers
                    bt.game.battle.timers.query(battleService);
                    // Process move response
                    bt.game.battle.battleField.actions._processMove(data);
                },
                // On error callback
                function(data) {
                    // Fire events
                    bt.services.battleService.Error.dispatch({ message: 'Error calling "BattleService.process_action()"!', data : data });
                    // TODO: Remove alert!
                    alert(data);
                }
            )
        },
        // Attacks unit ( unit object | unit id) at location ( {x, y} )
        attack : function(unit, targetLocation) {
            var unitId = (angular.isNumber(unit) ? unit : unit.id);
            battleService.calls.processAction(
                // Parameters
                [[ unitId, 'attack', [targetLocation.x, targetLocation.y] ]],
                // On successfull load callback
                function(data) {
                    // Fire events
                    bt.services.battleService.Called.dispatch({ message: 'Response from "BattleService.process_action().', data : data });
                    bt.services.battleService.BattleFieldAction_Attack.dispatch({ message: 'Response from "BattleService.process_action().', data : data });
                    // Refresh timers
                    bt.game.battle.timers.query(battleService);
                    // Process move response
                    bt.game.battle.battleField.actions._processAttack(data);
                },
                // On error callback
                function(data) {
                    // Fire events
                    bt.services.battleService.Error.dispatch({ message: 'Error calling "BattleService.process_action()"!', data : data });
                    // TODO: Remove alert!
                    alert(data);
                }
            )
        }
    }

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

// "Battle field new turn" event
bt.events.define(bt.services.battleService, 'BattleField_NewTurn');

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
                $scope.passTurn =  function() { BattleService.actions.pass(); };
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
            return  1000 * ((parseFloat(parsed[0]) * 3600) + (parseFloat(parsed[1]) * 60) + parseFloat(parsed[2]));
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
                var battleTime = (bt.game.battle.timers._battleTime - diff) / 1000;
                if (battleTime < 0) battleTime = 0;
                bt.game.battle.timers.battleTime = battleTime;
                bt.game.battle.timers.battleTimeFormated = Math.floor(battleTime / 3600) + ' : ' + Math.floor((battleTime % 3600) / 60) + ' : ' + Math.floor(battleTime % 60);
                var playTime = (bt.game.battle.timers._playTime - diff) / 1000;
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
                                                            if ((bt.game.battle.timers._parseServerTime(data.ply) > bt.game.battle.timers._playTime) && (bt.game.battle.timers._playTime !== null)) {
                                                                bt.services.battleService.BattleField_NewTurn.dispatch({ message: 'New turn!', data : data });
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
                battleService.actions.pass();
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
                    if (unit) bt.game.battle.model.battleField.grid.moveContent(unit, { x : location[0], y : location[1] });
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
            // Update HP
            if (data.HPs) for (var id in data.HPs) {
                var unit = bt.game.battle.model.battleField.units.unitsById[id];
                if (unit) unit.updateHp(data.HPs[id]);
            }
            // Update location
            if (data.locs) for (var id in data.locs) {
                var unit = bt.game.battle.model.battleField.units.unitsById[id];
                if (unit) bt.game.battle.model.battleField.grid.moveContent(unit, { x : data.locs[id][0], y : data.locs[id][1] });
            }
            // Update game status
            if (data.game_over) bt.game.battle.model.battleField.gameOver = data.game_over;
            if (data.whose_action) bt.game.battle.model.battleField.activePlayer = data.whose_action;

        }

    }

}

// Initialize 'battle view' model-view
// ---------------------------------------------------------------------------------------------------------------------
bt.game.battle.model = {

    // Holds reference to battle view's battleField model
    battleField : null

}

// TODO: Debugging: Hooked events
// ---------------------------------------------------------------------------------------------------------------------
bt.services.battleService.BattleField_NewTurn.subscribe( function(event) { alert("New turn!"); } );
bt.services.battleService.BattleFieldAction_Attack.subscribe( function(event) {  for (var i in event.data.response.result) alert('Attack does ' + event.data.response.result[i][1] + ' damage!'); } );
