"use strict";

    /* =====================================================================================================================
     *  Binary tactics: 'Equipment view' game functionalities
     * ================================================================================================================== */


// Initialize battle view
// ---------------------------------------------------------------------------------------------------------------------
bt.config.views.addView('equipment',   {
                                            id : 'bt.game.equipment',
                                            name : 'Assets',
                                            url : 'res/partials/views/equipment.html',
                                            depth : 2,
                                            isPublic : false,
                                            onLoad : function() { console.log('> Loading equipment view!'); },
                                            onUnload : function() { console.log('> Unloading equipment view!'); }
                                        });
