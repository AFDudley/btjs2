"use strict";

/* =====================================================================================================================
 *  Binary tactics: 'Debugging view' functionalities
 * ================================================================================================================== */


// Initialize battle view
// ---------------------------------------------------------------------------------------------------------------------
bt.config.views.addView('debugging',   {
                                            id : 'bt.game.debugging',
                                            name : '~ Debugging ~',
                                            url : 'res/partials/views/debugging.html',
                                            depth : 2,
                                            isPublic : false,
                                            onLoad : function() { },
                                            onUnload : function() { }
                                        }, false, true);


// Initialize 'debugging view' functionality
// ---------------------------------------------------------------------------------------------------------------------
bt.game.debugging = {

    // Battle view, angular references namespace
    ng : {

        // Reference to 'game common' controller
        controller : app.controller('bt.game.debugging.ng.controller', function($scope, BattleService) {
            // Set controller name (for scope detection/testing)
            $scope.controllerName = "bt.game.debugging.ng.controller";
            // Set reference to app namespace
            $scope.bt = bt;
            // Set reference to services
            $scope.services = {
                battle : BattleService
            };
            // Testing actions
            $scope.testing = {
                start : function() { bt.game.debugging.services.battle.testing.start(BattleService); },
                stop : function() { bt.game.debugging.services.battle.testing.stop(BattleService); },
                reset : function() { bt.game.debugging.services.battle.testing.stats.reset(); }
            }
        }).controller

    },

    // Services' debugging namespace
    services : {

        // Battle service debugging namespace
        battle : {

            // Battle service's testable methods
            methods : {
                getUsername : 'getUsername',
                timeLeft : 'timeLeft',
                initialState : 'initialState',
                lastResult : 'lastResult',
                getStates : 'getStates',
                getLastState : 'getLastState'
            },

            // Holds reference to method selected for testing
            selectedMethod : null,
            // Holds testing service call interval
            callInterval : 1000,

            // Testing functionalities namespace
            testing :  {

                // Holds current testing status
                isRunning : false,

                // Holds reference to the testing interval
                _interval : null,

                // Start testing battle service method calls
                start : function(battleService) {
                    // Set status
                    bt.game.debugging.services.battle.testing.isRunning = true;
                    // Clear interval
                    clearInterval(bt.game.debugging.services.battle.testing._interval);
                    // Start new interval
                    bt.game.debugging.services.battle.testing._interval = setInterval(function() {

                            bt.game.debugging.services.battle.testing.processCall();
                            bt.services.execute('BattleService', function(service) {
                                    var method = service.calls[bt.game.debugging.services.battle.selectedMethod];
                                    method([], bt.game.debugging.services.battle.testing.processSuccess, bt.game.debugging.services.battle.testing.processFail, bt.game.debugging.services.battle.testing.processError);
                                }, true);

                        }, bt.game.debugging.services.battle.callInterval);
                },

                // Stop testing battle service method calls
                stop : function(battleService) {
                    // Set status
                    bt.game.debugging.services.battle.testing.isRunning = false;
                    // Clear interval
                    clearInterval(bt.game.debugging.services.battle.testing._interval);
                },

                // Processes dispatched service call
                processCall : function() { bt.game.debugging.services.battle.testing.stats.calls++; },
                // Processes successfull service call
                processSuccess : function(data) { bt.game.debugging.services.battle.testing.stats.success++; bt.game.debugging.services.battle.testing.stats.update(); },
                // Processes failed service call
                processFail : function(data) { bt.game.debugging.services.battle.testing.stats.fail++; bt.game.debugging.services.battle.testing.stats.update(); },
                // Processes error in service call
                processError : function(data) { bt.game.debugging.services.battle.testing.stats.error++; bt.game.debugging.services.battle.testing.stats.update(); },

                // Testing statistics namespace
                stats : {
                    // Holds dispatched calls count
                    calls : 0,
                    // Holds successfull responses count
                    success : 0,
                    // Holds failed responses count
                    fail : 0,
                    // Holds error responses count
                    error: 0,

                    // Updates stats
                    update: function() {
                        bt.game.debugging.services.battle.testing.stats.rate = 100 * (bt.game.debugging.services.battle.testing.stats.success / bt.game.debugging.services.battle.testing.stats.calls);
                    },
                    // Clears stats
                    reset: function() {
                        bt.game.debugging.services.battle.testing.stats.calls = 0;
                        bt.game.debugging.services.battle.testing.stats.success = 0;
                        bt.game.debugging.services.battle.testing.stats.fail = 0;
                        bt.game.debugging.services.battle.testing.stats.error = 0;
                        bt.game.debugging.services.battle.testing.stats.update();
                    },

                    // Holds response success rate
                    rate: 100
                }

            }

        }

    }

}