"use strict";

    /* =====================================================================================================================
     *  Binary tactics: 'Battle view' game functionalities
     * ================================================================================================================== */


// Initialize battle view
// ---------------------------------------------------------------------------------------------------------------------
bt.config.views.addView('battleView',   {
                                            id : 'bt.game.battle',
                                            name : 'battle view ( ... must login first )',
                                            url : 'res/partials/views/battle.html',
                                            depth : 2,
                                            verify : function() { return (bt.game.common.user.username != null) && (bt.game.common.user.username.length > 0); },
                                            onLoad : function() { console.log('> Loading battle view!'); },
                                            onUnload : function() { console.log('> Unloading battle view!'); }
                                        });


// Services
// ---------------------------------------------------------------------------------------------------------------------

// Battle service
/*
        Console call syntax example:
    
            bt.services.execute('battleService', function(service) {
                                                    service.getUsername(
                                                                        function(data) { console.log("Success:"); console.log(data); },
                                                                        function(data) { console.log("Fail:"); console.log(data); }
                                                                    );
                                                });
*/
bt.services.battleService = app.factory('battleService', function (jsonRpc) {
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


// Initialize 'battle view' game functionality
// ---------------------------------------------------------------------------------------------------------------------
bt.game.battle = {
    
    // Battle view, angular references namespace
    ng : {
        
        // Reference to 'game common' controller
        controller : app.controller('bt.game.battle.ng.controller', function($scope, battleService) {
                // Set controller name (for scope detection/testing)
                $scope.controllerName = "bt.game.battle.ng.controller";
                // Set reference to app namespace
                $scope.bt = bt;
                // Set reference to services
                $scope.services = {
                    battle : battleService
                };
            }).controller
        
    }

}
