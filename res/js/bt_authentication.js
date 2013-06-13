"use strict";

    /* =====================================================================================================================
     *  Binary tactics: Authentication
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
bt.services.authenticationService = app.factory('AuthenticationService', function ($http) {
        return {
            
            // Authenticate method, takes onSuccess and onFail callback functions
            // Calls authentication service and trys authenticating user
            authenticate : function(username, password, onSuccess, onFail, onError) {
                // Check if authentication in progress
                if (bt.game.authentication.login._isAuthenticating) return false;
                // Update username and password
                if (username != null) bt.game.authentication.login.username = username;
                if (password != null) bt.game.authentication.login.password = password;
                // Prompt authenticating
                // Set authenticating username and status
                bt.game.authentication.login._isAuthenticating = true;
                bt.game.authentication.login._authUsername = bt.game.authentication.login.username;
                $http({
                    
                    // Service call configuration
                    method: 'POST',
                    url: '/auth/login',
                    params : { u : bt.game.authentication.login.username, p : bt.game.authentication.login.password}
                    
                }).success(function(data, status, headers, config) {
                    
                    // Handle response: Success / Check response
                    if (data.login == "successful") {
                        // Authenticate
                        bt.game.authentication.isAuthenticated = true;
                        bt.game.authentication.username = bt.game.authentication.login._authUsername;
                        // Execute callback
                        if (onSuccess) onSuccess(data, status, headers(), config);
                        // Fire event
                        bt.services.authenticationService.authenticationSuccessfull.dispatch( 'Authentication successfull.' );
                    } else {
                        // De-Authenticate
                        bt.game.authentication.isAuthenticated = false;
                        bt.game.authentication.username = '';
                        // Execute callback
                        if (onFail) onFail(data, status, headers(), config);
                        // Fire event
                        bt.services.authenticationService.authenticationFailed.dispatch( 'Authentication failed.' );
                    }
                    // Set authenticating status
                    bt.game.authentication.login._isAuthenticating = false;
                    
                }).error(function(data, status, headers, config) {
                    
                    // De-Authenticate
                    bt.game.authentication.isAuthenticated = false;
                    bt.game.authentication.username = '';
                    // Execute callback
                    if (onError) onError(data, status, headers(), config);
                    if (onFail) onFail(data, status, headers(), config);
                    // Fire event
                    bt.services.authenticationService.authenticationError.dispatch( 'Authentication error!' );
                    // Set authenticating status
                    bt.game.authentication.login._isAuthenticating = false;
                    
                });
                // Return 'started authentication'
                return true;
            }
            
        }
    });


// Initialize common game functionality
// ---------------------------------------------------------------------------------------------------------------------
bt.game.authentication = {

    // Holds authentication status
    isAuthenticated : false,
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

    }

}


// Custom events definitions
// ---------------------------------------------------------------------------------------------------------------------

// @ bt.services.authService

// "Authentication successfull" event
bt.events.define(bt.services.authenticationService, 'authenticationSuccessfull');
// "Authentication failed" event (Fired when server invalidates authentication)
bt.events.define(bt.services.authenticationService, 'authenticationFailed');
// "Authentication error" event (Fired on authentication request error)
bt.events.define(bt.services.authenticationService, 'authenticationError');
