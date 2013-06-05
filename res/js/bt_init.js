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
    if (this.name == null) this.name = '';
    if (this.url == null) this.url = '';
    if (this.depth == null) this.depth = 0;
}

// Main application namespace
// ---------------------------------------------------------------------------------------------------------------------
var bt = {
    
        // Angular references namespace
        ng : {
            
            // Reference to main module
            module : angular.module('bt', []),
            // Reference to main controller
            controller : angular.module('bt', []).controller('bt.ng.controller', function($scope) {
                    // Set reference to app namespace
                    $scope.bt = bt;
                })
            
        },
        
        // Configuration namespace
        config : { },
        
        // Navigation namespace
        navigation : {
            
            // Holds reference to the selected view
            selectedView : null,
            // Holds reference to next view
            nextView : null,
            // Selects passed view
            selectView : function(view) {
                if (view == null) {
                    bt.navigation.selectedView = bt.navigation.nextView;
                } else if (typeof view == 'object') {
                    bt.navigation.nextView = view;
                    bt.navigation.selectedView = view;
                } else {
                    for (var i in bt.config.views) {
                        if (bt.config.views[i].name == view) {
                            bt.navigation.nextView = bt.config.views[i];
                            bt.navigation.selectedView = bt.config.views[i];
                            break;
                        }
                    }
                }
            }
            
        }
    
    }
    
    
// Startup
// ---------------------------------------------------------------------------------------------------------------------

window.addEventListener('load', function() {

        // Nothing so far ...

    }, false);