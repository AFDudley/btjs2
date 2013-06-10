"use strict";

    /* =====================================================================================================================
     *  Binary tactics: Configuration
     * ================================================================================================================== */



// Configuration namespace
// ---------------------------------------------------------------------------------------------------------------------

// Holds root path of URL where application is deployed
bt.config.urls = {
    clientUrl :     '/battle/static/btjs2/',
    servicesUrl :   '/battle/'
}

// Add public views
bt.config.views.addView('frontpage',    {
                                            id : 'bt.game.common',
                                            name : 'frontpage',
                                            url : 'res/partials/views/frontpage.html',
                                            depth : 0,
                                            verify : function() { return true; },
                                            onLoad : function() { console.log('> Loading frontpage view!'); },
                                            onUnload : function() { console.log('> Unloading frontpage view!'); }
                                        });
bt.navigation.selectView( bt.config.views.viewsByName.frontpage );

// Set debugging options
bt.debugging.events.pushToConsole = true;
