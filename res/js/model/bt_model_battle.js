"use strict";

/* =====================================================================================================================
 *  Binary tactics: 'Battle data model' definition
 * ================================================================================================================== */


// Initialize data model
// ---------------------------------------------------------------------------------------------------------------------
bt.model.definitions.battle = {

    // Most basic entity
    stone : function(obj) {
        // Extend passed object
        if (obj) bt.model.extend(this, obj);
        // Verify children
        if (bt.debugging.model.verifyModelConstructors) for (var element in bt.model.common.elements.definitions) {
            if (!angular.isDefined(this[bt.model.common.elements.definitions[element]])) console.error(obj, 'Stone object definition incomplete: Missing "' + bt.model.common.elements.definitions[element] + '" element!');
        }
    },

    // Differentiated stone definition
    dStone : function(obj) {
         // Extend pased object
        if (obj) bt.model.extend(this, obj);
        // Verify children
        if (bt.debugging.model.verifyModelConstructors) {
            if (!angular.isDefined(this.comp)) console.error(obj, 'Weapon object definition incomplete: Missing composition!!');
            if (!angular.isDefined(this.element)) console.error(obj, 'Weapon object definition incomplete: Missing element differentiation!');
        }
        // Initialize children
        this.comp = new bt.model.definitions.battle.stone(this.comp);
    },

    // Weapon definition
    weapon : function(obj) {
        // Extend pased object
        if (obj) bt.model.extend(this, obj);
        // Verify children
        if (bt.debugging.model.verifyModelConstructors) {
            var hasWeapon = false;
            for (var weapon in bt.model.common.weapons.definitions) if (angular.isDefined(this[bt.model.common.weapons.definitions[weapon]])) hasWeapon = true;
            if (!hasWeapon) console.error(obj, 'Weapon object definition incomplete: Missing weapon!');
        }
        // Initialize children
        for (var weapon in bt.model.common.weapons.definitions) {
            if (angular.isDefined(this[bt.model.common.weapons.definitions[weapon]])) {
                this._type = bt.model.common.weapons.definitions[weapon];
                this[bt.model.common.weapons.definitions[weapon]] = new bt.model.definitions.battle.dStone(this[bt.model.common.weapons.definitions[weapon]]);
            }
        }

        // Gets weapon dStone definition
        this.getDStone = function() {return this[this._type]; }
        this._dStone = this[this._type];
    },

    // Basic unit definition
    unit : function(obj) {
        // Extend pased object
        if (obj) bt.model.extend(this, [obj, new bt.model.definitions.battle.dStone(obj)]);
        // Verify children
        if (bt.debugging.model.verifyModelConstructors) {
            if ((!angular.isDefined(this.location)) || (this.location.length != 2)) console.error(obj, 'Unit object definition incomplete: Missing location!');
            if (!angular.isDefined(this.name)) console.error(obj, 'Unit object definition incomplete: Missing name!');
        }
        // Initialize children
        this.updateStats = function() {
            this.value = this.comp[bt.model.common.elements.definitions.E] + this.comp[bt.model.common.elements.definitions.F] +this.comp[bt.model.common.elements.definitions.I] + this.comp[bt.model.common.elements.definitions.W];
            this.general = {
                attack : (4 * this.value),
                defense : (2 * this.value)
            };
            this.physical = { };
            this.physical.value = (2 * this.value);
            this.physical.attack = (this.physical.value + this.general.attack + (2 * this.comp[bt.model.common.elements.definitions.F]));
            this.physical.defense = (this.physical.value + this.general.defense + (2 * this.comp[bt.model.common.elements.definitions.E]));
            this.magic = { };
            this.magic.value = (2 * this.value);
            this.magic.attack = (this.magic.value + this.general.attack + (2 * this.comp[bt.model.common.elements.definitions.I]));
            this.magic.defense = (this.magic.value + this.general.defense + (2 * this.comp[bt.model.common.elements.definitions.W]));
            this.hp = (4 * (this.physical.defense + this.magic.defense + this.value));
        }
        this.updateStats();
    },

    // Scient unit definition
    scient : function(obj) {
        // Extend pased object
        if (obj) bt.model.extend(this, [obj, new bt.model.definitions.battle.unit(obj)]);
        // Verify children
        if (bt.debugging.model.verifyModelConstructors) {
            if (!angular.isDefined(this.id)) console.error(obj, 'Unit object definition incomplete: Missing id!');
            if (!angular.isDefined(this.owner)) console.error(obj, 'Unit object definition incomplete: Missing owner!');
            if (!angular.isDefined(this.sex)) console.error(obj, 'Unit object definition incomplete: Missing sex!');
            if (!angular.isDefined(this.weapon)) console.error(obj, 'Unit object definition incomplete: Missing weapon!');
            if ((!angular.isDefined(this.weapon_bonus)) || (!angular.isDefined(this.weapon_bonus.stone))) console.error(obj, 'Unit object definition incomplete: Missing weapon bonus!');
        }
        // Initialize children
        this.weapon = new bt.model.definitions.battle.weapon(this.weapon);
        if (angular.isDefined(this.weaponBonus)) {
            this.weaponBonus = new bt.model.definitions.battle.stone(this.weaponBonus);
        } else if ( (angular.isDefined(this.weapon_bonus)) && (angular.isDefined(this.weapon_bonus.stone)) && (angular.isDefined(this.weapon_bonus.stone.comp)) ) {
            this.weaponBonus = new bt.model.definitions.battle.stone(this.weapon_bonus.stone.comp);
        } else {
            this.weaponBonus = new bt.model.definitions.battle.stone();
        }
    }


/*

    function Grid(grid) {
        "use strict";
        Stone.call(this, copy_comp(grid.comp));
        this.x = grid.x;
        this.y = grid.y;
        this.size = [this.x, this.y];
        //convert tiles and contents.
        var tiles = [];
        for (var i in _.range(this.x)) {
            tiles[i] = [];
            for (var j in _.range(this.y)) {
                var tcomp = copy_comp(grid.tiles[i][j].tile.comp);
                var contents = null;
                try {
                    contents = new Scient(grid.tiles[i][j].tile.contents.scient);
                } catch (e) {}
                tiles[i][j] = new Tile(tcomp, contents);
            }
        }
        this.tiles = tiles;
    }

    function Battlefield(grid, init_locs, owners) {
        "use strict";
        this.grid = new Grid(grid); // from json
        this.locs = init_locs;
        this.owners = owners;
        this.HPs = {};
        this.units = {};
        for (var key in this.locs) {
            var loc = this.locs[key];
            var unit = this.grid.tiles[loc[0]][loc[1]].contents;
            if (unit) {
              this.HPs[key] = unit.hp;
              this.units[unit.ID] = unit;
            }
        }
        this.graveyard = {};
        this.dmg_queue = {};
        this.direction = {
            0: 'North',
            1: 'Northeast',
            2: 'Southeast',
            3: 'South',
            4: 'Southwest',
            5: 'Northwest'
        };
        this.ranged = ['Bow', 'Magma', 'Firestorm', 'Forestfire', 'Pyrocumulus'];
        this.DOT = ['Glove', 'Firestorm', 'Icestorm', 'Blizzard', 'Pyrocumulus'];
        this.AOE = ['Wand', 'Avalanche', 'Icestorm', 'Blizzard', 'Permafrost'];
        this.Full = ['Sword', 'Magma', 'Avalanche', 'Forestfire', 'Permafrost'];

        //Grid operations
        //dumb port
        this.on_grid = function(tile) {
            if (0 <= tile[0] && tile[0] < this.grid.x) {
                if (0 <= tile[1] && tile[1] < this.grid.y) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        };

        //DUMB port from hex_battlefield.py
        this.move_scient = function(unitID, dest) {
            //TODO test me
            ///move unit from src tile to dest tile
            var xsrc, ysrc, xdest, ydest = undefined;
            var src = this.locs[unitID];
            if (this.on_grid(src)) {
                xsrc = src[0];
                ysrc = src[1];
            } else {
                throw "Source " + src + " is off grid.";
            }
            if (this.on_grid(dest)) {
                xdest = dest[0];
                ydest = dest[1];
            } else {
                throw "Destination " + dest + " is off grid.";
            }
            if (this.grid.tiles[xsrc][ysrc].contents) {
                if (!this.grid.tiles[xdest][ydest].contents) {
                    var move = this.grid.tiles[xsrc][ysrc].contents.move;
                    var range = this.makeRange(src, move);
                    if (!range.add(dest)) {
                        this.grid.tiles[xdest][ydest].contents = this.grid.tiles[xsrc][ysrc].contents;
                        this.locs[unitID] = [xdest, ydest];
                        this.grid.tiles[xsrc][ysrc].contents = null;
                        return true;
                    } else {
                        throw "tried moving more than " + move + " tiles.";
                    }
                } else {
                    throw "There is already something at " + dest + ".";
                }
            } else {
                throw "There is nothing at " + src + ".";
            }
        };

        this.apply_dmg = function(unitID, amount) {
            var unit = this.units[unitID];
            if (typeof amount === "number") {
                unit.hp -= amount;
            } else if (amount === "Dead.") {
                unit.hp = 0;
            }
            if (unit.hp <= 0) {
                this.bury(unit);
            }
        };
        this.apply_HPs = function(HPs) {
            //Applies damage from last_state.
            for (var ID in HPs) {
              this.units[ID].hp = HPs[ID];
            }
        }
        this.apply_queued = function() {}; //getting this right will be tricky.
        this.bury = function(unit) {

            // ensure hp is non negative
            unit.hp = 0;

            // add to graveyard
            this.graveyard[unit.ID] = unit;

            // remove from units lookup
            delete this.units[unit.ID];

            // remove from damage queue
            //delete this.queued[unit.ID];

            // remove from grid tile
            this.grid.tiles[unit.location[0]][unit.location[1]].contents = null;

            // clear location?
            //unit.location = [-1, -1];
        };

        this.get_adjacent = function(tile, direction) {
            var direction = typeof direction !== 'undefined' ? direction : 'All';
            var xpos = tile[0];
            var ypos = tile[1];
            var directions = {
                "East": [
                    [xpos + 1, ypos], ],
                "West": [
                    [xpos - 1, ypos], ]
            };
            if (ypos & 1) {
                directions["North"] = [
                    [xpos + 1, ypos - 1],
                    [xpos, ypos - 1]
                ];
                directions["South"] = [
                    [xpos + 1, ypos + 1],
                    [xpos, ypos + 1]
                ];
                directions["Northeast"] = [
                    [xpos + 1, ypos - 1],
                    [xpos + 1, ypos]
                ];
                directions["Southeast"] = [
                    [xpos + 1, ypos + 1],
                    [xpos + 1, ypos]
                ];
                directions["Southwest"] = [
                    [xpos, ypos + 1],
                    [xpos - 1, ypos]
                ];
                directions["Northwest"] = [
                    [xpos, ypos - 1],
                    [xpos - 1, ypos]
                ];
            } else {
                directions["North"] = [
                    [xpos, ypos - 1],
                    [xpos - 1, ypos - 1]
                ];
                directions["South"] = [
                    [xpos, ypos + 1],
                    [xpos - 1, ypos + 1]
                ];
                directions["Northeast"] = [
                    [xpos, ypos - 1],
                    [xpos + 1, ypos]
                ];
                directions["Southeast"] = [
                    [xpos, ypos + 1],
                    [xpos + 1, ypos]
                ];
                directions["Southwest"] = [
                    [xpos - 1, ypos + 1],
                    [xpos - 1, ypos]
                ];
                directions["Northwest"] = [
                    [xpos - 1, ypos - 1],
                    [xpos - 1, ypos]
                ];
            }
            directions["All"] = [];
            directions["All"] = directions["All"].concat(directions["North"], directions["East"], directions["South"], directions["West"]);
            var out = new JS.Set();
            var idx, len;
            for (idx = 0, len = directions[direction].length; idx < len; idx++) {
                var loc = directions[direction][idx];
                if (this.on_grid(loc)) {
                    out.add(loc);
                }
            }
            return out;
        };
        //Nescient operations
        this.make_parts = function() {};
        this.make_body = function() {};
        this.body_on_grid = function() {};
        this.can_move_nescient = function() {};
        this.move_nescient = function() {};
        this.place_nescient = function() {};
        this.get_rotations = function() {};
        this.rotate = function() {};

        this.getUnitByLocation = function(location) {
            for (var u in this.units) {
                var unit = this.units[u];
                if (unit) {
                    if (_.isEqual(location, unit.location)) {
                        return unit;
                    }
                }
            }
        }

        // this should be done in GameState.init by computing a reverse lookup
        this.getUnitIdByLocation = function(location) {
            for (var id in this.locs) {
                var loc = this.locs[id];
                if (loc[0] === location[0] &&
                    loc[1] === location[1]) {
                    return id;
                }
            }
        }

        // weapon ops
        this.make_pattern = function(loc, distance, pointing) {
            //var tiles = [];
            var pattern = [];
            var head = this.get_adjacent(loc, pointing);
            var cols = 1;
            while (cols !== distance) {
                pattern = pattern.concat(head.toArray());
                var temp_head = head;
                head = new JS.Set();
                for (var tloc in temp_head) {
                    head.add(this.get_adjacent(tloc, pointing));
                }
                cols++;
            }
            return pattern;
        };

        this.tilesInRangeOfWeapon = function(loc, weapon) {
            var weaponHasRange = false;
            var weaponHasAOE = false;
            for (var w in this.ranged) {
                if (this.ranged[w] === weapon.wep_type) {
                    weaponHasRange = true;
                    break;
                }
            }
            for (var w2 in this.AOE) {
                if (this.AOE[w2] === weapon.wep_type) {
                    weaponHasAOE = true;
                    break;
                }
            }
            if (weaponHasRange) {
                var move = 4;
                var no_hit = this.makeRange(loc, move);
                var hit = this.makeRange(loc, 2 * move);
                return hit.difference(no_hit);
            } else if (weaponHasAOE) {
                var tiles = [];
                for (var x = 0; x < this.grid.x; x++) {
                    for (var y = 0; y < this.grid.y; y++) {
                        if (x !== loc[0] || y !== loc[1]) {
                            var pt = [x, y];
                            tiles.push();
                        }
                    }
                }
                return tiles;
            } else {
                return this.get_adjacent(loc);
            }
        };

        this.makeRange = function(location, distance) {
            var tilesets = [];
            tilesets.push(this.get_adjacent(location));
            while (tilesets.length < distance) {
                var tileset = tilesets.slice(-1)[0].entries().sort();
                var new_tileset = new JS.Set();
                for (var n in tileset) {
                    var tile = tileset[n];
                    new_tileset.merge(this.get_adjacent(tile));
                }
                tilesets.push(new_tileset);
            }
            var group = new JS.Set();
            for (var t in tilesets) {
                group = group.union(tilesets[t].entries().sort());
            }
            return group;
        };

        this.print = function() {
            for (var key in this.locs) {
                var loc = this.locs[key];
                this.HPs[key] = this.grid.tiles[loc[0]][loc[1]].contents.hp;
            }
            console.log("userID        Loc Owner HPs");
            for (var puserID in this.locs) {
                console.log("\t" + puserID + ": " + this.locs[puserID] + " " + this.owners[puserID] + "\t" + this.HPs[puserID]);        }
        };
    }

*/

}