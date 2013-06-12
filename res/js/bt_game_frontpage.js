"use strict";

    /* =====================================================================================================================
     *  Binary tactics: Frontpage game functionalities
     * ================================================================================================================== */


// Initialize battle view
// ---------------------------------------------------------------------------------------------------------------------

bt.config.views.addView('frontpage',    {
                                            id : 'bt.game.frontpage',
                                            name : 'Frontpage',
                                            url : 'res/partials/views/frontpage.html',
                                            depth : 0,
                                            isPublic : true,
                                            onLoad : function() { console.log('> Loading frontpage view!'); },
                                            onUnload : function() { console.log('> Unloading frontpage view!'); }
                                        }, true, false);


// Initialize frontpage game functionality
// ---------------------------------------------------------------------------------------------------------------------
bt.game.frontpage = {
    
    // Game common, angular references namespace
    ng : {
        
        // Reference to 'game common' controller
        controller : app.controller('bt.game.frontpage.ng.controller', function($scope, AuthenticationService) {
                // Set controller name (for scope detection/testing)
                $scope.controllerName = "bt.game.frontpage.ng.controller";
                // Set reference to app namespace
                $scope.bt = bt;
                // Set reference to services
                $scope.services = {
                    authenticationService : AuthenticationService
                };
            }).controller
        
    }
    
}