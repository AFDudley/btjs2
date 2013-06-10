"use strict";

    /* =====================================================================================================================
     *  Binary tactics: Common game functionalities
     * ================================================================================================================== */


// Services
// ---------------------------------------------------------------------------------------------------------------------

// Authentication service
/*
        Console call syntax example:
    
            bt.services.execute('authService', function(service) {
                                                    service.authenticate( 'atkr', 'atkr2', function() { alert("Success"); }, function() { alert("Fail!"); } );
                                                });
*/
bt.services.authService = app.factory('authService', function ($http) {
        return {
            
            // Authenticate method, takes onSuccess and onFail callback functions
            // Calls authentication service and trys authenticating user
            authenticate : function(username, password, onSuccess, onFail, onError) {
                // Check if authentication in progress
                if (bt.game.common.user.login._isAuthenticating) return false;
                // Update username and password
                if (username != null) bt.game.common.user.login.username = username;
                if (password != null) bt.game.common.user.login.password = password;
                // Prompt authenticating
                // Set authenticating username and status
                bt.game.common.user.login._isAuthenticating = true;
                bt.game.common.user.login._authUsername = bt.game.common.user.login.username
                $http({
                    
                    // Service call configuration
                    method: 'POST',
                    url: '/auth/login',
                    params : { u : bt.game.common.user.login.username, p : bt.game.common.user.login.password}
                    
                }).success(function(data, status, headers, config) {
                    
                    // Handle response: Success / Check response
                    if (data.login == "successful") {
                        // Authenticate
                        bt.game.common.user.username = bt.game.common.user.login._authUsername;
                        // Execute callback
                        if (onSuccess) onSuccess(data, status, headers(), config);
                        // Fire event
                        bt.services.authService.authSuccess.dispatch({
                                                                        detail: {
                                                                            message:'Authentication successfull.',
                                                                            time: new Date(),
                                                                        },
                                                                        
                                                                });
                    } else {
                        // Execute callback
                        if (onFail) onFail(data, status, headers(), config);
                        // Fire event
                        bt.services.authService.authFail.dispatch({
                                                                        detail: {
                                                                            message:'Authentication failed.',
                                                                            time: new Date(),
                                                                        },
                                                                        
                                                                });
                    }
                    // Set authenticating status
                    bt.game.common.user.login._isAuthenticating = false;
                    
                }).error(function(data, status, headers, config) {
                    
                    // Execute callback
                    if (onError) onError(data, status, headers(), config);
                    if (onFail) onFail(data, status, headers(), config);
                    // Fire event
                    bt.services.authService.authError.dispatch({
                                                                        detail: {
                                                                            message:'Authentication error!',
                                                                            time: new Date(),
                                                                        },
                                                                        
                                                                });
                    // Set authenticating status
                    bt.game.common.user.login._isAuthenticating = false;
                    
                });
                // Return 'started authentication'
                return true;
            }
            
        }
    });


// Initialize common game functionality
// ---------------------------------------------------------------------------------------------------------------------
bt.game.common = {
    
    // Game common, angular references namespace
    ng : {
        
        // Reference to 'game common' controller
        controller : app.controller('bt.game.common.ng.controller', function($scope, authService) {
                // Set controller name (for scope detection/testing)
                $scope.controllerName = "bt.game.common.ng.controller";
                // Set reference to app namespace
                $scope.bt = bt;
                // Set reference to services
                $scope.services = {
                    auth : authService
                };
            }).controller
        
    },
    
    // User namespace
    user : {
        
        // Holds user's username
        username : '',

        // Login functionality namespace        
        login : {
            
            _isAuthenticating : false,
            // Currently authenticating username
            _authUsername : '',
            
            // Holds user's username
            username : 'atkr',
            // Holds user's password
            password : 'atkr'

        },
        
    }
    
}

// Custom events definitions
// ---------------------------------------------------------------------------------------------------------------------

// @ bt.services.authService

// "Authentication successfull" event
bt.events.define(bt.services.authService, 'authSuccess');
// "Authentication failed" event (Fired when server invalidates authentication)
bt.events.define(bt.services.authService, 'authFail');
// "Authentication error" event (Fired on authentication request error)
bt.events.define(bt.services.authService, 'authError');