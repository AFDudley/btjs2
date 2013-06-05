"use strict";

    /* =====================================================================================================================
     *  Binary tactics: Configuration
     * ================================================================================================================== */



// Configuration namespace
// ---------------------------------------------------------------------------------------------------------------------

// Holds root path of URL where application is deployed
bt.config.rootUrl = '/battle/static/btjs2/';

// Holds application views configuration
bt.config.views =   [
                        { name : 'frontpage',       url : 'res/partials/views/frontpage.html',      depth : 0 },
                        { name : 'equanimity view', url : 'res/partials/views/equanimity.html',     depth : 1 },
                        { name : 'battle view',     url : 'res/partials/views/battle.html',         depth : 2 },
                        { name : 'equipment view',  url : 'res/partials/views/equipment.html',      depth : 3 },
                    ];
bt.navigation.selectView( bt.config.views[0] );