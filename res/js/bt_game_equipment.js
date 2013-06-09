"use strict";

    /* =====================================================================================================================
     *  Binary tactics: 'Equipment view' game functionalities
     * ================================================================================================================== */


// Initialize battle view
// ---------------------------------------------------------------------------------------------------------------------
bt.config.views.addView('equipmentView',   {
                                            id : 'bt.game.equipment',
                                            name : 'equipment view ( ... must login first )',
                                            url : 'res/partials/views/equipment.html',
                                            depth : 2,
                                            verify : function() { return (bt.game.common.user.username != null) && (bt.game.common.user.username.length > 0); },
                                            onLoad : function() { console.log('> Loading equipment view!'); },
                                            onUnload : function() { console.log('> Unloading equipment view!'); }
                                        });
