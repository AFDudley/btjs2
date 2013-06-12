"use strict";

    /* =====================================================================================================================
     *  Binary tactics: 'Equanimity view' game functionalities
     * ================================================================================================================== */


// Initialize equanimity view
// ---------------------------------------------------------------------------------------------------------------------
bt.config.views.addView('equanimity',   {
                                            id : 'bt.game.equanimity',
                                            name : 'EQUANIMITY',
                                            url : 'res/partials/views/equanimity.html',
                                            depth : 2,
                                            isPublic : false,
                                            onLoad : function() { console.log('> Loading equanimity view!'); },
                                            onUnload : function() { console.log('> Unloading equanimity view!'); }
                                        });
