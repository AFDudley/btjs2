"use strict";

    /* =====================================================================================================================
     *  Binary tactics: Initialization
     * ================================================================================================================== */



// Dependancy classes
// ---------------------------------------------------------------------------------------------------------------------

// Holds view data
var btView = function(obj) {
    // Inherits from passed object
    if ((obj !== null) && (typeof obj == 'object')) {
        angular.extend(this, obj);
    }
    // Set uninherited properties
    if (this.id == null) this.id = '';
    if (this.name == null) this.name = '';
    if (this.url == null) this.url = '';
    if (this.depth == null) this.depth = 0;
    // Set uninherited methods
    if (this.isPublic == null) this.isPublic = true;
    if (this.onLoad == null) this.onLoad = null;
    if (this.onUnload == null) this.onUnload = null;

    // Validate method: checks if view can be loaded
    if (this.validate == null) this.validate = function() {
        return ((this.isPublic) || ((bt.game) && (bt.game.authentication) && (bt.game.authentication.isAuthenticated)));
    }
}


// Initialize main game module
// ---------------------------------------------------------------------------------------------------------------------
var app = angular.module('bt', ['angular-json-rpc', 'angular-interval']);

// Main application namespace
// ---------------------------------------------------------------------------------------------------------------------
var bt = {
    
        // Angular references namespace
        ng : {
            
            // Reference to main angular module
            app : app,
            // Reference to main controller
            controller : app.controller('bt.ng.controller', function($scope, AuthenticationService) {
                    // Set reference to app namespace
                    $scope.bt = bt;
                    // Set controller name (for scope detection/testing)
                    $scope.controllerName = "bt.ng.controller";
                    // Set reference to services
                    $scope.services = {
                        authenticationService : AuthenticationService
                    };
                }).controller
            
        },
        
        // Configuration namespace
        config : {

            // Web URLs namespace
            urls : {

                // Holds client-side URL path
                clientUrl :     '/',
                // Holds server-side URL path
                servicesUrl :   '/'

            },
            
            // Views configuration namespace
            views : {
            
                // Holds array of available views
                viewsArray : [ /* Filled implicitly from other JS scripts */ ],
                // Holds dictionary of avaliable views by name
                viewsByName : { /* Filled implicitly from other JS scripts */ },
                
                // Holds reference to currently selected view
                _currentView : null,
                // Holds default public (unauthenticated) view
                _defaultPublicView : null,
                // Holds default private (authenticated) view
                _defaultPrivateView : null,
                
                // Adds new view
                addView : function(name, view, isDefaultPublic, isDefaultAuthenticated) {
                    // Wrap view as btView object
                    view = new btView(view);
                    // Check defaults
                    if (isDefaultPublic) bt.config.views._defaultPublicView = view;
                    if (isDefaultAuthenticated) bt.config.views._defaultPrivateView = view;
                    // Set ordering properties
                    view._index = bt.config.views.viewsArray.length;
                    view._key = name;
                    // Add view to registry
                    bt.config.views.viewsArray.push(view);
                    bt.config.views.viewsByName[name] = view;
                    // Set route
                    app.config(['$routeProvider', function($routeProvider) {
                            // Set route to view
                            $routeProvider  .when('/' + view._key, { templateUrl: view.url })
                                            .otherwise('/');
                        }]);
                }
            
            },
            
            // Server poling namespace
            poling : {
                
                // Holds value for minimal time interval between polling same service in [ms]
                minimalIntervalBetweenPolls : 2000,

                // Battle view namespace
                battle : {
                    // Last state refreshing interval
                    lastStateRefreshInterval : 4000
                }
                
            },

            // Game namespace
            game : {

                // Battle view namespace
                battle : {

                    // CSS Styles configuration namespace
                    styles : {
                        // Selected tile CSS class name
                        selected    : 'tile_selected',
                        // Selected tile CSS class name
                        move        : 'tile_move',
                        // Selected tile CSS class name
                        range       : 'tile_range',
                        // Selected tile CSS class name
                        attack      : 'tile_attack',

                        // Player's unit CSS class name
                        player : 'player',
                        // Enemy unit CSS class name
                        enemy : 'enemy',

                        // Number of animated variations for unit sprite
                        unitSpriteVariationsCount : 1,
                        // Timeout for damage notification animation
                        damegeNotificationTimeout : 2000
                    },

                    // Actions configuration namespace
                    actions : {
                        // Holds unit's move radius
                        moveRadius : 1,
                        // Toggles if actions and movement can pass through other units
                        jumpUnits : true,
                        // Toggles if player can attack his own units
                        friendlyFire : true
                    }

                }

            }
            
        },
        
        // Game namespace ()
        game : {
        
            // Common game functionality
            common : {},
            // Equinimity view functionality
            equanimity : {},
            // Battle view functionality
            battle : {},
            // Equipment view functionality
            equipment : {}
            
        },
        
        // Services' hooks
        services : {
            
            /* Filled implicitly from other JS scripts */
        
            // Takes a service name reference and function with initialted service for argument and executes function over service
            execute : function (service, fn, apply) {
                if (typeof service == 'string') service = angular.element(document.body).injector().get(service);
                fn(service);
                if (apply) angular.element(document.body).scope().$apply();
            }
            
        },

        // Data model definitions namespace
        model : {

            // Model definitions namespace
            definitions : { /* Filled implicitly from other JS scripts */ },

            // Extends from object or array of objects
            extend : function(target, objs) {
                // Check if object or array
                if (angular.isArray(objs)) {
                    // Extend from array
                    for (var obj in objs) angular.extend(target, objs[obj]);
                } else {
                    // Extend from object
                    angular.extend(target, objs);
                }
            }

        },

        // Non DOM events namespace
        events : {
            
            // Toggles events push to console
            publishToConsole : true,
            
            // Holds event listeners
            _listeners : [ ],
            
            // Adds a definition of custom event
            define : function(target, eventName) {
                target[eventName] = {
                    // Attach event name
                    _bt_event_name : eventName,
                    // Attach event target
                    _bt_event_target : target,
                    // Attach event subscriber to target
                    subscribe : function(fn) {
                        bt.events.subscribe(this._bt_event_target, this._bt_event_name, fn);
                    },
                    // Attach event dispatcher to target
                    dispatch : function(event) {
                        return bt.events.dispatch(this._bt_event_target, this._bt_event_name, event);
                    }                    
                }
            },
            
            // Subscribes to event on target
            subscribe : function(target, eventName, fn) {
                // Add to global event registry
                if (bt.events._listeners[eventName] == null) bt.events._listeners[eventName] = [ ];
                bt.events._listeners[eventName].push(fn);
                // Add to global event registry
                if (target[eventName]._bt_event_subscribed == null) target[eventName]._bt_event_subscribed = [ ];
                target[eventName]._bt_event_subscribed.push(fn);
            },
            // Dispatch event for target
            dispatch : function(target, eventName, event) {
                // Format event
                if (typeof event == 'string') event = { message : event, time : new Date() };
                // Check if pushing to console
                if (bt.debugging.events.publishToConsole) {
                    console.log('>>> Event "' + eventName + '" dispatched to ' + (target[eventName]._bt_event_subscribed ? target[eventName]._bt_event_subscribed.length : '0') + ' listeners! Folowing event / target:');
                    console.log(target);
                    console.log(event);
                }
                // Initialize event listeners aggregate result
                var results = { true: 0, false: 0 };
                // Process event listeners
                if (target[eventName]._bt_event_subscribed) {
                    for (var i in target[eventName]._bt_event_subscribed) {
                        var fn = target[eventName]._bt_event_subscribed[i];
                        var result = fn(event, target);
                        if (result === true) results.true++;
                        if (result === false) results.false++;
                    }
                }
                // Return aggregate result
                return ((results.true > 0) || (results.false > 0) ? results : null);
            }
            
        },
        
        // Debugging / Testing namespace
        debugging : {
            
            // Events namespace
            events : {
                // Toggles events push to console
                publishToConsole : false
            },

            // Data model namespace
            model : {
                // Toggles if model constructors will test received properties
                verifyModelConstructors : false
            },

            // Game namespace
            game : {

                // Toggles wuick authentication panel
                showQuickAuth : false,

                // Battle view namepsace
                battle : {
                    // Toggles if battle log is shown
                    showBattleLog : true
                }
            }
        }

    }


// Custom events definitions
// ---------------------------------------------------------------------------------------------------------------------

// @ bt.navigation

// "View changed" event
bt.events.define(bt.config.views, 'viewAccepted');
// 'View rejected' event (Fired when view verification fails)
bt.events.define(bt.config.views, 'viewPrevented');
// 'View rejected' event (Fired when view verification fails)
bt.events.define(bt.config.views, 'viewChanged');
// 'View error' event (Fired when view loading fails)
bt.events.define(bt.config.views, 'viewFailed');


// Startup
// ---------------------------------------------------------------------------------------------------------------------

// Handle route changes and view verification
app.run( function($rootScope, $location) {

        // Handle route changing event
        $rootScope.$on( "$routeChangeStart", function(event, next, current) {
                // Find and validate route/view
                if (next.templateUrl) {
                    for (var name in bt.config.views.viewsByName) {
                        var view = bt.config.views.viewsByName[name];
                        if ((next.templateUrl == view.url) && (view.validate())) {
                            // Selected view validated
                            if (view != bt.config.views._currentView) {
                                if (bt.config.views._currentView) bt.config.views._currentView.onUnload();
                                view.onLoad();
                                bt.config.views._currentView = view;
                            }
                            bt.config.views.viewAccepted.dispatch( 'View "' + next.templateUrl + '" selected.' );
                            return;
                        }
                    }
                }
                // Prevent route
                event.preventDefault();
                bt.config.views.viewPrevented.dispatch( 'View "' + next.templateUrl + '" prevented.' );
                // Fallback to default route
                if (bt.config.views._defaultPrivateView.validate()) {
                    next.templateUrl = bt.config.views._defaultPrivateView.url;
                    if (view != bt.config.views._currentView) {
                        if (bt.config.views._currentView) bt.config.views._currentView.onUnload();
                        bt.config.views._defaultPrivateView.onLoad();
                        bt.config.views._currentView = bt.config.views._defaultPrivateView;
                    }
                    $location.path('/' + bt.config.views._defaultPrivateView._key);
                } else {
                    next.templateUrl = bt.config.views._defaultPublicView.url;
                    if (view != bt.config.views._currentView) {
                        if (bt.config.views._currentView) bt.config.views._currentView.onUnload();
                        bt.config.views._defaultPublicView.onLoad();
                        bt.config.views._currentView = bt.config.views._defaultPublicView;
                    }
                    $location.path('/' + bt.config.views._defaultPublicView._key);
                }
            });
        
        // Handle route changed or failed events
        $rootScope.$on( "$routeChangeSuccess", function(event, next, current) {
                // Selected view validated
                if ((!current) || (next.templateUrl != current.templateUrl)) bt.config.views.viewChanged.dispatch( 'View "' + next.templateUrl + '" changed.' );
            });
        $rootScope.$on( "$routeChangeError", function(event, next, current) {
                // Selected view validated
            if ((!current) || (next.templateUrl != current.templateUrl)) bt.config.views.viewFailed.dispatch( 'View "' + next.templateUrl + '" failed.' );
            });

    });

// On loaded
window.addEventListener('load', function() {

        // Nothing so far ...

    }, false);