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
bt.services.battleService = app.factory('BattleService', function (jsonRpc) {
        // Settup service
        jsonRpc.setup( { 'url': bt.config.urls.servicesUrl } );
        // Map service
        return  {
                    // Get username method
                    getUsername :   jsonRpc.method('get_username',      []),
                    // Time left method
                    timeLeft :      jsonRpc.method('time_left',         []),
                    // Initial state method
                    initialState :  jsonRpc.method('initial_state',     []),
                    // Last result method
                    lastResult :    jsonRpc.method('last_result',       []),
                    // Get states method
                    getStates :     jsonRpc.method('get_states',        []),
                    // Get last state method
                    getLastState :  jsonRpc.method('get_last_state',    []),
                    // Process action method
                    processAction : jsonRpc.method('process_action',    [])
                }
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

// "Battle field initialized" event
bt.events.define(bt.services.battleService, 'BattleFieldInitialized');
// "Battle field updated" event
bt.events.define(bt.services.battleService, 'BattleFieldUpdated');

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
            }).controller
        
    },
    
    // View manipulation namespace
    view : {
        // On view load
        // TODO: Set interval inside Angular context
        onLoad : function() {
                    // Query server time
                    bt.game.battle.timers.query();
                    // Start timer interval
                    if (bt.game.battle.timers._interval) clearInterval(bt.game.battle.timers._interval);
                    bt.game.battle.timers._interval = setInterval(bt.game.battle.timers.update, 1000);
                    // Initialize model-view
                    bt.game.battle.model.initialization.initialize();
            },
        // On view unload
        // TODO: Set interval inside Angular context
        onUnload : function() {
                    // Stop timer interval
                    if (bt.game.battle.timers._interval) clearInterval(bt.game.battle.timers._interval);
                    // Destroy model-view
                    bt.game.battle.model.initialization.destroy();
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
        battleTime : null,
        // Holds remaining play (turn) time
        playTime : null,
        
        // Parses server timer format to milliseconds
        _parseServerTime : function(time) {
            var parsed = time.split(':');
            return  1000 * ((parseFloat(parsed[0]) * 3600) + (parseFloat(parsed[1]) * 60) + parseFloat(parsed[2]));
        },
        
        // Querys timers with battle service
        query : function() {
            // Check time since last query
            if ((new Date() - bt.game.battle.timers._lastQueryTime) > bt.config.poling.minimalIntervalBetweenPolls) {
                // Query timers from service
                bt.services.execute('BattleService', function(service) {
                                                        service.timeLeft(
                                                                            // Success callback
                                                                            function(data) {
                                                                                    // Set data
                                                                                    if ((data) && (data.battle) && (data.ply)) {
                                                                                        bt.game.battle.timers._battleTime = bt.game.battle.timers._parseServerTime(data.battle);
                                                                                        bt.game.battle.timers._playTime = bt.game.battle.timers._parseServerTime(data.ply);
                                                                                        bt.game.battle.timers._lastQueryTime = new Date();
                                                                                        // Fire event
                                                                                        bt.services.battleService.Called.dispatch({ message: 'Response from "BattleService.timeLeft()".', data : data });
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
                                                    });
                    }
        },
        
        // Updates timers based on last queryed values (calls query if no values)
        update : function() {
            // Check for last queryed values
            if (!bt.game.battle.timers._lastQueryTime) {
                // Query values 
                bt.game.battle.timers.query();
            } else {
                // Recalculate values
                var diff = (new Date()) - bt.game.battle.timers._lastQueryTime;
                bt.services.execute('BattleService', function(service) {
                                                            var battleTime = (bt.game.battle.timers._battleTime - diff) / 1000;
                                                            bt.game.battle.timers.battleTime = Math.floor(battleTime / 3600) + ' : ' + Math.floor((battleTime % 3600) / 60) + ' : ' + Math.floor(battleTime % 60);
                                                            var playTime = (bt.game.battle.timers._playTime - diff) / 1000;
                                                            bt.game.battle.timers.playTime = Math.floor(playTime / 3600) + ' : ' + Math.floor((playTime % 3600) / 60) + ' : ' + Math.floor(playTime % 60);
                                                        });
                // Fire event
                bt.services.battleService.Updated.dispatch({
                                                            message: 'Updated "BattleService" timers'
                                                        });
            }
        }
        
    }

}

// Initialize 'battle view' model-view
// ---------------------------------------------------------------------------------------------------------------------
bt.game.battle.model = {

    // Battle view's view-model's initialization namespace
    initialization : {

        // Initializes view-model
        initialize : function() {

            // Get initial state
            bt.services.execute('BattleService', function(service) {
                service.initialState(
                    // On successfull load callback
                    function(data) {
                        // Fire events
                        bt.services.battleService.Called.dispatch({ message: 'Response from "BattleService.init_state().', data : data });
                        bt.services.battleService.BattleFieldInitialized.dispatch({ message: 'Response from "BattleService.init_state().', data : data });
                        bt.services.battleService.BattleFieldUpdated.dispatch({ message: 'Response from "BattleService.init_state().', data : data });
                        // Initialize view-model's battleField from response
                        bt.game.battle.model.battleField = new bt.model.definitions.battle.battleField(data);
                    },
                    // On error callback
                    function(data) {
                        // Fire events
                        bt.services.battleService.Error.dispatch({ message: 'Error calling "BattleService.init_state()"!', data : data });
                    }
                );
            });

        },

        // Destroys view-model
        destroy : function() {
            delete bt.game.battle.model.battleField;
        }

    },

    // Holds reference to battle view's battleField model
    battleField : null

}