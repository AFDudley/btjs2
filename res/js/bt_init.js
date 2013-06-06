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
}


// Initialize main game module
// ---------------------------------------------------------------------------------------------------------------------
var app = angular.module('bt', []);

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
        config : { },
        
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
                if (bt.navigation.nextView != null) {
                    // Select transition effect
                    bt.effects.viewChange = ((bt.navigation.selectedView == null) || (bt.navigation.nextView.depth > bt.navigation.selectedView.depth) ? bt.effects.viewChangeIn : bt.effects.viewChangeOut);
                    // Select view
                    bt.navigation.selectedView = bt.navigation.nextView;
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
        services : { /* Filled implicitly from other JS scripts */ }

    }


// Startup
// ---------------------------------------------------------------------------------------------------------------------

window.addEventListener('load', function() {

        // Nothing so far ...

    }, false);