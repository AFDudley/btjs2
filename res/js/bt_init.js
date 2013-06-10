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
        this.extend(obj);
    }
    // Set uninherited properties
    if (this.id == null) this.id = '';
    if (this.name == null) this.name = '';
    if (this.url == null) this.url = '';
    if (this.depth == null) this.depth = 0;
    // Set uninherited methods
    if (this.verify == null) this.verify = function() { return true; };
    if (this.onLoad == null) this.onLoad = null;
    if (this.onUnload == null) this.onUnload = null;
}


// Initialize main game module
// ---------------------------------------------------------------------------------------------------------------------
var app = angular.module('bt', ['angular-json-rpc']);

// Main application namespace
// ---------------------------------------------------------------------------------------------------------------------
var bt = {
    
        // Angular references namespace
        ng : {
            
            // Reference to main angular module
            app : app,
            // Reference to main controller
            controller : app.controller('bt.ng.controller', function($scope) {
                    // Set reference to app namespace
                    $scope.bt = bt;
                    // Set controller name (for scope detection/testing)
                    $scope.controllerName = "bt.ng.controller";
                }).controller
            
        },
        
        // Configuration namespace
        config : {
            
            // Views configuration namespace
            views : {
            
                // Holds array of available views
                viewsArray : [ /* Filled implicitly from other JS scripts */ ],
                // Holds dictionary of avaliable views by name
                viewsByName : { /* Filled implicitly from other JS scripts */ },
                
                // Adds new view
                addView : function(name, view) {
                    bt.config.views.viewsArray.push(view);
                    bt.config.views.viewsByName[name] = view;
                }
            
            }
            
        },
        
        // Navigation (between views) namespace
        navigation : {
            
            // Holds reference to the selected view
            selectedView : null,
            // Holds reference to next view
            nextView : null,
            // Selects passed view
            selectView : function(view) {
                // Get next view
                if (view == null) {
                    // Already got next view
                } else if (typeof view == 'object') {
                    // Set view object
                    bt.navigation.nextView = view;
                } else {
                    // Get object by name
                    for (var i in bt.config.views) {
                        if (bt.config.views[i].name == view) {
                            bt.navigation.nextView = bt.config.views[i];
                            break;
                        }
                    }
                }
                // Check next view
                if ((bt.navigation.nextView != null)) {
                    // Verify view available
                    if (bt.navigation.nextView.verify()) {
                        // Select transition effect
                        bt.effects.viewChange = ((bt.navigation.selectedView == null) || (bt.navigation.nextView.depth > bt.navigation.selectedView.depth) ? bt.effects.viewChangeIn : bt.effects.viewChangeOut);
                        // Run onLoad and onUnload callbacks
                        if ((bt.navigation.selectedView != null) && (bt.navigation.selectedView.onUnload != null)) bt.navigation.selectedView.onUnload();
                        if ((bt.navigation.nextView != null) && (bt.navigation.nextView.onLoad != null)) bt.navigation.nextView.onLoad();
                        // Select view
                        bt.navigation.selectedView = bt.navigation.nextView;
                        // Fire event
                        bt.navigation.viewChanged.dispatch({
                                                                detail: {
                                                                    message:'View "' + bt.navigation.nextView.name + '" selected.',
                                                                    time: new Date(),
                                                                }
                                                            });
                    } else {
                        // Fire event
                        bt.navigation.viewRejected.dispatch({
                                                                detail: {
                                                                    message:'View "' + bt.navigation.nextView.name + '" verification rejected.',
                                                                    time: new Date(),
                                                                }
                                                            });
                        // Clean up
                        bt.navigation.nextView = bt.navigation.selectedView;
                    }
                } else {
                    // Fire event
                    bt.navigation.viewError.dispatch({
                                                        detail: {
                                                            message:'Failed loading view!',
                                                            time: new Date(),
                                                        }
                                                    });
                    // Clean up
                    bt.navigation.nextView = bt.navigation.selectedView;
                }
                
            }
            
        },
        
        // Transition effects namespace
        effects : {
            
            // Holds current view changed effect
            viewChange      : '', 
            // Names 'view change in' transition effect
            viewChangeIn    : 'slideL',
            // Names 'view change out' transition effect
            viewChangeOut   : 'slideR'
            
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
            execute : function (service, fn) {
                if (typeof service == 'string') service = angular.element(document.body).injector().get(service);
                fn(service);
                angular.element(document.body).scope().$apply();                
            }
            
        },
        
        // Non DOM events namespace
        events : {
            
            // Toggles events push to console
            _pushToConsole : true,
            
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
                        bt.events.dispatch(this._bt_event_target, this._bt_event_name, event);
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
                // Check if pushing to console
                if (bt.debugging.events.publishToConsole) {
                    console.log('Event "' + eventName + '" dispatched to ' + (target[eventName]._bt_event_subscribed ? target[eventName]._bt_event_subscribed.length : '0') + ' listeners! Event fired by:');
                    console.log(target);
                }
                // Process event listeners
                if (target[eventName]._bt_event_subscribed) {
                    for (var i in target[eventName]._bt_event_subscribed) {
                        var fn = target[eventName]._bt_event_subscribed[i];
                        fn(event, target);
                    }
                }
            }
            
        },
        
        // Debugging / Testing namespace
        debugging : {
            
            // Events namespace
            events : {
                // Toggles events push to console
                publishToConsole : false
            }
        }

    }


// Custom events definitions
// ---------------------------------------------------------------------------------------------------------------------

// @ bt.navigation

// "View changed" event
bt.events.define(bt.navigation, 'viewChanged');
// 'View rejected' event (Fired when view verification fails)
bt.events.define(bt.navigation, 'viewRejected');
// 'View error' event (Fired when view loading fails)
bt.events.define(bt.navigation, 'viewError');


// Startup
// ---------------------------------------------------------------------------------------------------------------------

window.addEventListener('load', function() {

        // Nothing so far ...

    }, false);