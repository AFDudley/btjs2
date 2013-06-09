"use strict";

    /* =====================================================================================================================
     *  Binary tactics: 'Equanimity view' game functionalities
     * ================================================================================================================== */


// Initialize equanimity view
// ---------------------------------------------------------------------------------------------------------------------
bt.config.views.addView('equanimityView',   {
                                            id : 'bt.game.equanimity',
                                            name : 'equanimity view ( ... must login first )',
                                            url : 'res/partials/views/equanimity.html',
                                            depth : 2,
                                            verify : function() { return (bt.game.common.user.username != null) && (bt.game.common.user.username.length > 0); },
                                            onLoad : function() { console.log('> Loading equanimity view!'); },
                                            onUnload : function() { console.log('> Unloading equanimity view!'); }
                                        });
