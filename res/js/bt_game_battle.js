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
        Console call syntax:
    
            bt.services.execute('battleService', function(service) {
                                                    service.getUsername(
                                                                        function(data) { console.log("Success:"); console.log(data); },
                                                                        function(data) { console.log("Fail:"); console.log(data); }
                                                                    );
                                                });
            bt.services.execute('battleService', function(service) {
                                                    service.timeLeft(
                                                                        function(data) { console.log("Success:"); console.log(data); },
                                                                        function(data) { console.log("Fail:"); console.log(data); }
                                                                    );
                                                });
            bt.services.execute('battleService', function(service) {
                                                    service.initialState(
                                                                        function(data) { console.log("Success:"); console.log(data); },
                                                                        function(data) { console.log("Fail:"); console.log(data); }
                                                                    );
                                                });
            bt.services.execute('battleService', function(service) {
                                                    service.lastResult(
                                                                        function(data) { console.log("Success:"); console.log(data); },
                                                                        function(data) { console.log("Fail:"); console.log(data); }
                                                                    );
                                                });
            bt.services.execute('battleService', function(service) {
                                                    service.getStates(
                                                                        function(data) { console.log("Success:"); console.log(data); },
                                                                        function(data) { console.log("Fail:"); console.log(data); }
                                                                    );
                                                });
            bt.services.execute('battleService', function(service) {
                                                    service.getLastState(
                                                                        function(data) { console.log("Success:"); console.log(data); },
                                                                        function(data) { console.log("Fail:"); console.log(data); }
                                                                    );
                                                });
            bt.services.execute('battleService', function(service) {
                                                    service.processAction(
                                                                        'action type',
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
                    getUsername : function(onSuccess, onFail) {
                                    return jsonRpc.request(
                                                            'get_username',
                                                            { params : [] },
                                                            function (data) {
                                                                    if (onSuccess) onSuccess(data);
                                                                },
                                                            function (data) {
                                                                    if (onFail) onFail(data);
                                                                }
                                                );
                                },
                    // Time left method
                    timeLeft : function(onSuccess, onFail) {
                                    return jsonRpc.request(
                                                            'time_left',
                                                            { params : [] },
                                                            function (data) {
                                                                    if (onSuccess) onSuccess(data);
                                                                },
                                                            function (data) {
                                                                    if (onFail) onFail(data);
                                                                }
                                                );
                                },
                    // Initial state method
                    initialState : function(onSuccess, onFail) {
                                    return jsonRpc.request(
                                                            'initial_state',
                                                            { params : [] },
                                                            function (data) {
                                                                    if (onSuccess) onSuccess(data);
                                                                },
                                                            function (data) {
                                                                    if (onFail) onFail(data);
                                                                }
                                                );
                                },
                    // Last result method
                    lastResult : function(onSuccess, onFail) {
                                    return jsonRpc.request(
                                                            'last_result',
                                                            { params : [] },
                                                            function (data) {
                                                                    if (onSuccess) onSuccess(data);
                                                                },
                                                            function (data) {
                                                                    if (onFail) onFail(data);
                                                                }
                                                );
                                },
                    // Get states method
                    getStates : function(onSuccess, onFail) {
                                    return jsonRpc.request(
                                                            'get_states',
                                                            { params : [] },
                                                            function (data) {
                                                                    if (onSuccess) onSuccess(data);
                                                                },
                                                            function (data) {
                                                                    if (onFail) onFail(data);
                                                                }
                                                );
                                },
                    // Get last state method
                    getLastState : function(onSuccess, onFail) {
                                    return jsonRpc.request(
                                                            'get_last_state',
                                                            { params : [] },
                                                            function (data) {
                                                                    if (onSuccess) onSuccess(data);
                                                                },
                                                            function (data) {
                                                                    if (onFail) onFail(data);
                                                                }
                                                );
                                },
                    // Process action method
                    processAction : function(type, onSuccess, onFail) {
                                    return jsonRpc.request(
                                                            'process_action',
                                                            { params : { type : type } },
                                                            function (data) {
                                                                    if (onSuccess) onSuccess(data);
                                                                },
                                                            function (data) {
                                                                    if (onFail) onFail(data);
                                                                }
                                                );
                                }
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
