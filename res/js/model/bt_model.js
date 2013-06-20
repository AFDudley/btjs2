"use strict";

/* =====================================================================================================================
 *  Binary tactics: 'data model' definition
 * ================================================================================================================== */

// Initialize data model
// ---------------------------------------------------------------------------------------------------------------------
bt.model.common = {

    // Basic elements namespace
    elements : {

        // Holds basic elements definitions / types
        definitions : {
            E : 'Earth',
            F : 'Fire',
            I : 'Ice',
            W : 'Wind'
        },
        // Gets element definition from name
        getDefinition : function(element) {
            for (var i in bt.model.common.elements.definitions) if (element == bt.model.common.elements.definitions[i]) return bt.model.common.elements.definitions[i];
            return null;
        }

    },

    // Basic weapons namespace
    weapons : {

        // Holds basic weapons definitions
        definitions : {
            bow     : 'bow',
            glove   : 'glove',
            wand    : 'wand',
            sword   : 'sword',

            magma       : 'magma',
            firestorm   : 'firestorm',
            forestfire  : 'forestfire',
            pyrocumulus : 'pyrocumulus',
            icestorm    : 'icestorm',
            blizzard    : 'blizzard',
            avalanche   : 'avalanche',
            permafrost  : 'permafrost'
        },
        // Gets weapon definition from name
        getDefinition : function(weapon) {
            for (var i in bt.model.common.weapons.definitions) if (weapon == bt.model.common.weapons.definitions[i]) return bt.model.common.weapons.definitions[i];
            return null;
        },

        // Holds basic weapons by types
        types : {
            ranged  : [ 'bow', 'magma', 'firestorm', 'forestfire', 'pyrocumulus' ],
            dot     : [ 'glove', 'firestorm', 'icestorm', 'blizzard', 'pyrocumulus' ],
            aoe     : [ 'wand', 'avalanche', 'icestorm', 'blizzard', 'permafrost' ],
            full    : [ 'sword', 'magma', 'avalanche', 'forestfire', 'permafrost' ]
        },
        // Gets weapon type from name
        getType : function(weapon) {
            for (var i in bt.model.common.weapons.types) {
                for (var j in bt.model.common.weapons.types[i]) if (weapon == bt.model.common.weapons.types[i][j]) return i;
            }
            return null;
        },

        ranges : {
            ranged  : { min : 4, max : 8 },
            dot     : { min : 1, max : 1 },
            aoe     : { min : 1, max : Number.MAX_VALUE },
            full    : { min : 1, max : 1 }
        },
        // Gets weapon range from name
        getRange : function(weapon) {
            var type = bt.model.common.weapons.getType(weapon);
            if (bt.model.common.weapons.ranges[type]) return bt.model.common.weapons.ranges[type];
            return null;
        }

    },

    // Basic unit namespace
    units : {

        // Holds basic unit definitions / types
        definitions : {
            scient : 'scient',
            nescient : 'nescient',
            part : 'part'
        },
        // Gets unit definition from name
        getDefinition : function(unit) {
            for (var i in bt.model.common.units.definitions) if (unit == bt.model.common.units.definitions[i]) return bt.model.common.units.definitions[i];
            return null;
        }

    }

}
