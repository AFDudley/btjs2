"use strict";

/* =====================================================================================================================
 *  Binary tactics: 'Battle view's data model' definitions
 * ================================================================================================================== */


// Battle view's data model definition
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

    // Stone as composition
    cStone : function(obj) {
        // Verify children
        if (bt.debugging.model.verifyModelConstructors) {
            if (!angular.isDefined(obj.comp)) console.error(obj, 'cStone object definition incomplete: Missing composition!!');
        }
        // Initialize children
        this.comp = new bt.model.definitions.battle.stone(obj.comp);
    },

    // Differentiated stone definition
    dStone : function(obj) {
        // Extend pased object
        if (obj) bt.model.extend(this, new bt.model.definitions.battle.cStone(obj));
        // Verify children
        if (bt.debugging.model.verifyModelConstructors) {
            if (!angular.isDefined(obj.element)) console.error(obj, 'dStone object definition incomplete: Missing element differentiation!');
        }
        // Initialize children
        this.element = obj.element;
    },

    // Localized definition
    localized : function(obj) {
        // Extend location from passed object
        if ((angular.isDefined(obj.location)) && (obj.location.length == 2)) {
            this.location = {
                x : obj.location[0],
                y : obj.location[1]
            }
        } else if ((angular.isDefined(obj.location)) && (angular.isDefined(obj.location.x)) && (angular.isDefined(obj.location.y))) {
            this.location = {
                x : obj.location.x,
                y : obj.location.y
            }
        }
        // Verify children
        if (bt.debugging.model.verifyModelConstructors) {
            if ((!angular.isDefined(this.location)) || (!angular.isDefined(this.location.x)) || (!angular.isDefined(this.location.y))) console.error(obj, 'Localized object definition incomplete: Missing location!');
        }

        // Update functionality
        this.updateLocation = function(location) {
            if ((angular.isArray(location)) && (location.length == 2)) {
                this.location.x = location[0];
                this.location.y = location[1];
            } else if (angular.isObject(location)) {
                this.location.x = location.x;
                this.location.y = location.y;
            }
        }
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
        if (obj) bt.model.extend(this, [obj, new bt.model.definitions.battle.dStone(obj), new bt.model.definitions.battle.localized(obj)]);
        // Verify children
        if (bt.debugging.model.verifyModelConstructors) {
            if (!angular.isDefined(this.name)) console.error(obj, 'Unit object definition incomplete: Missing name!');
        }
        // Initialize children
        this.updateStats = function() {
            this.value = this.comp[bt.model.common.elements.definitions.E] + this.comp[bt.model.common.elements.definitions.F] +this.comp[bt.model.common.elements.definitions.I] + this.comp[bt.model.common.elements.definitions.W];
            this.general = {
                value : this.value,
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
            this.hp = null;
            this._damage = { has : false, amount: 0 };
        }
        this.updateStats();

        // Update unit's Hp
        this.updateHp = function(hp) {
            if ((angular.isNumber(hp)) && (hp > 0)) {
                // Check if damage
                if ((this.hp === null) || (hp < this.hp)) {
                    // Anounce damage taken
                    bt.game.battle.battleField.UnitDamage.dispatch({ unit: this, hp: hp });
                    // Update Hp
                    this.hp = hp;
                }
            } else if ((hp) || (hp === 0)) {
                // Anounce unit dead
                bt.game.battle.battleField.UnitDead.dispatch({ unit: this, hp: hp });
                // Reset unit's hp
                this.hp = 0;
            }

        }
    },

    // Grid definition
    unitsCollection : function() {
        // Initialize children
        this.units = [ ];
        this.unitsById = [ ];
        this.unitsByType = [ ];
        this.unitsByOwner = [ ];

        // Adds a tile to the grid
        this.addUnit = function(unit) {
            this.units.push(unit);
            if (unit.id) {
                this.unitsById[unit.id] = unit;
            }
            if (unit.owner) {
                if (!angular.isDefined(this.unitsByOwner[unit.owner])) this.unitsByOwner[unit.owner] = [ ];
                this.unitsByOwner[unit.owner].push(unit);
            }
            if (unit._type) {
                if (!angular.isDefined(this.unitsByType[unit._type])) this.unitsByType[unit._type] = [ ];
                this.unitsByType[unit._type].push(unit);
            }
        }
    },

    // Scient unit definition
    scient : function(obj) {
        // Extend pased object
        if (obj) bt.model.extend(this, [obj, new bt.model.definitions.battle.unit(obj)]);
        // Verify children
        if (bt.debugging.model.verifyModelConstructors) {
            if (!angular.isDefined(this.id)) console.error(obj, 'Scient object definition incomplete: Missing id!');
            if (!angular.isDefined(this.owner)) console.error(obj, 'Scient object definition incomplete: Missing owner!');
            if (!angular.isDefined(this.sex)) console.error(obj, 'Scient object definition incomplete: Missing sex!');
            if (!angular.isDefined(this.weapon)) console.error(obj, 'Scient object definition incomplete: Missing weapon!');
            if ((!angular.isDefined(this.weapon_bonus)) || (!angular.isDefined(this.weapon_bonus.stone))) console.error(obj, 'Scient object definition incomplete: Missing weapon bonus!');
        }
        // Initialize children
        this._type = bt.model.common.units.definitions.scient;
        this.style = (this.owner == bt.game.authentication.username ? bt.config.game.battle.styles.player : bt.config.game.battle.styles.enemy) + '_' + Math.ceil(Math.random() * bt.config.game.battle.styles.unitSpriteVariationsCount);
        this.weapon = new bt.model.definitions.battle.weapon(this.weapon);
        if (angular.isDefined(this.weaponBonus)) {
            this.weaponBonus = new bt.model.definitions.battle.stone(this.weaponBonus);
        } else if ( (angular.isDefined(this.weapon_bonus)) && (angular.isDefined(this.weapon_bonus.stone)) && (angular.isDefined(this.weapon_bonus.stone.comp)) ) {
            this.weaponBonus = new bt.model.definitions.battle.cStone(this.weapon_bonus.stone);
        } else {
            this.weaponBonus = new bt.model.definitions.battle.stone();
        }
    },

    // Single grid tile definition
    tile : function(obj) {
        // Extend pased object
        if (obj) bt.model.extend(this, [new bt.model.definitions.battle.localized(obj), new bt.model.definitions.battle.cStone(obj)]);
        // Initialize children
        this.contents = [ ];
        this.units = { }
        for (var type in bt.model.common.units.definitions) {
            this.units[bt.model.common.units.definitions[type]] = [ ];
        }

        // Adds content to tile
        this.addContent = function(content) {
                this.contents.push(content);
                var type = bt.model.common.units.getDefinition(content._type);
                if (type) this.units[type].push(content);
            };
        // Removes content from tile
        this.removeContent = function(content) {
                for (var i in this.contents) if (this.contents[i] == content) this.contents.splice(i, 1);
                var type = bt.model.common.units.getDefinition(content._type);
                if (type) for (var i in this.units[type]) if (this.units[type][i] == content) this.units[type].splice(i, 1);
            };
        // Clears all title's content
        this.clearContent = function(content) {
                this.contents = [ ];
                var type = bt.model.common.units.getDefinition(content._type);
                if (type) this.units[type] = [ ];
            };

        this.isOwnedByPlayer = function() {
            for (var i in this.contents) {
                if (this.contents[i].owner == bt.game.authentication.username) return true;
            }
            return false;
            }
    },

    // Holds dead units for each of the players
    graveyard : function() {
        var base = this;

        // Initialize children
        this.units = { };

        // Adds a unit to graveyard
        this.addUnit = function(unit) {
            var player = unit.owner;
            if (!base.units[player]) base.units[player] = { };
            base.units[player][unit.id] = unit;
        }
    },

    // Grid definition
    grid : function(obj) {

        // Initialization
        // ---------------------------------------------------------

        var base = this;

        // Extend pased object
        if (obj) bt.model.extend(this, [new bt.model.definitions.battle.cStone(obj)]);
        // Verify children
        if (bt.debugging.model.verifyModelConstructors) {
            if (!angular.isDefined(obj.x)) console.error(obj, 'Grid object definition incomplete: Missing X!');
            if (!angular.isDefined(obj.y)) console.error(obj, 'Grid object definition incomplete: Missing Y!');
        }
        // Initialize children
        this.size  = { x : obj.x, y : obj.y };
        this.tiles = [ ];
        this.tilesByX = [ ];
        this.tilesByY = [ ];

        // Adds a tile to the grid
        this.addTile = function(tile) {
            this.tiles.push(tile);
            if (!angular.isDefined(this.tilesByX[tile.location.x])) this.tilesByX[tile.location.x] = [];
            this.tilesByX[tile.location.x][tile.location.y] = tile;
            if (!angular.isDefined(this.tilesByY[tile.location.y])) this.tilesByY[tile.location.y] = [];
            this.tilesByY[tile.location.y][tile.location.x] = tile;
        }

        // Tiles manipulation
        // ---------------------------------------------------------

        // Gets all neighbouring tiles with distances from source less than radius and with no units in the way
        this.getNeighourTiles = function(sourceTile, radius, result) {
            // Initialize result
            if (!result) result = { };
            // Get neighbouring tiles
            var neighbouringTiles = [
                            { x : sourceTile.location.x - 1, y : sourceTile.location.y },
                            { x : sourceTile.location.x + 1, y : sourceTile.location.y },
                            { x : sourceTile.location.x + (sourceTile.location.y % 2 == 1 ? 0 : -1), y : sourceTile.location.y - 1 },
                            { x : sourceTile.location.x + (sourceTile.location.y % 2 == 1 ? 0 : -1) + 1, y : sourceTile.location.y - 1 },
                            { x : sourceTile.location.x + (sourceTile.location.y % 2 == 1 ? 0 : -1), y : sourceTile.location.y + 1 },
                            { x : sourceTile.location.x + (sourceTile.location.y % 2 == 1 ? 0 : -1) + 1, y : sourceTile.location.y + 1 }
                        ];
            // Get source radius
            var sourceTileId = sourceTile.location.x + 'x' + sourceTile.location.y;
            var sourceRadius = (result[sourceTileId] ? result[sourceTileId].radius : 0);
            // Process neighbouring tiles
            for (var i in neighbouringTiles) {
                var neighbouringTile = neighbouringTiles[i];
                var neighbouringTileId = neighbouringTile.x + 'x' + neighbouringTile.y;
                if ((base.tilesByX[neighbouringTile.x]) && (base.tilesByX[neighbouringTile.x][neighbouringTile.y]) && ((!result[neighbouringTileId]) || (result[neighbouringTileId].radius > (sourceRadius + 1)))) {
                    // Add tile to result
                    var resultTile = base.tilesByX[neighbouringTile.x][neighbouringTile.y];
                    resultTile.distance = sourceRadius + 1;
                    result[neighbouringTileId] = { radius : resultTile.distance, tile : resultTile };
                    // Process further neighbours
                    if ((radius > 1) && ((bt.config.game.battle.actions.jumpUnits) || (resultTile.contents.length == 0))) base.getNeighourTiles(resultTile, (radius - 1), result);
                }
            }
            // Return result
            return result;
        },

        // Moves content to new tile
        this.moveContent = function(content, targetLocation) {
            // Get content location
            var sourceLocation = content.location;
            // Get source and target tiles
            var sourceTile = this.tilesByX[sourceLocation.x][sourceLocation.y];
            var targetTile = this.tilesByX[targetLocation.x][targetLocation.y];
            // Move content
            if (sourceTile != targetTile) {
                sourceTile.removeContent(content);
                targetTile.addContent(content);
                if (this.selectedTile == sourceTile) this._selectTile(targetTile);
                content.updateLocation(targetLocation);
            }
        }

        // UI interpretation
        // ---------------------------------------------------------

        // Holds reference to selected tile
        this.selectedTile = null;
        this.processTileClick = function(battleService, tile) {
            // Check if tile is selectable
            if (tile.avaliableAction) {
                // Fire 'tile action execute' event
                var results = bt.game.battle.battleField.TileActionExecute.dispatch(tile);
                // Check event handlers' results
                if ((results === null) || (results.false == 0)) {
                    // Execute tile action
                    this._executeActionOnTile(battleService, tile);
                    // Fire 'tile action executed' event
                    bt.game.battle.battleField.TileActionExecuted.dispatch(tile);
                }
            } else {
                // Select or deselect tile
                if (tile != this.selectedTile) {

                    // Check if owned by player
                    if ((tile.units[bt.model.common.units.definitions.scient].length > 0) && (tile.units[bt.model.common.units.definitions.scient][0].owner == bt.game.authentication.username)) {

                        // Fire 'select tile' event
                        var results = bt.game.battle.battleField.TileSelect.dispatch(tile);
                        // Check event handlers' results
                        if ((results === null) || (results.false == 0)){
                            // Select tile
                            this._selectTile(tile);
                            // Fire 'selected tile' event
                            bt.game.battle.battleField.TileSelected.dispatch(tile);
                        }
                    }

                } else {
                    // Fire 'deselect tile' event
                    var results = bt.game.battle.battleField.TileDeselect.dispatch(tile);
                    // Check event handlers' results
                    if ((results === null) || (results.false == 0)) {
                        // Deselect tile
                        this._selectTile(null);
                        // Fire 'deselected tile' event
                        bt.game.battle.battleField.TileDeselected.dispatch(tile);
                    }
                }
            }
        }
        // Sets tile as selected
        this._selectTile = function(tile) {
            // Clear tiles' styles and actions
            for (var i in this.tiles) {
                this.tiles[i].style = null;
                this.tiles[i].avaliableAction = null;
                this.tiles[i].distance = null;
            }
            // Set selected tile
            this.selectedTile = tile;
            if (tile) this.selectedTile.style = bt.config.game.battle.styles.selected;
            if ((tile) && (tile.isOwnedByPlayer())) {
                // Calculate weapon attack radius
                var units = this.selectedTile.units[bt.model.common.units.definitions.scient];
                if (units.length > 0) {
                    var unit = units[0];
                    var weapon = unit.weapon;
                    if (weapon) {
                        var attackRadius = bt.model.common.weapons.getRange(weapon._type);
                        if (attackRadius) {
                            var minAttackRadius = attackRadius.min, maxAttackRadius = attackRadius.max;

                            // Set tiles' styles and actions
                            var nearTiles = base.getNeighourTiles(this.selectedTile, (maxAttackRadius > bt.config.game.battle.actions.moveRadius ? maxAttackRadius : bt.config.game.battle.actions.moveRadius));
                            for (var i in nearTiles) {
                                if ((nearTiles[i].tile != this.selectedTile)
                                    &&((nearTiles[i].tile.units[bt.model.common.units.definitions.scient].length > 0)
                                    && ((bt.config.game.battle.actions.friendlyFire) || (!nearTiles[i].tile.isOwnedByPlayer())))
                                    && ((nearTiles[i].radius >= minAttackRadius) && (nearTiles[i].radius <= maxAttackRadius))) {
                                    nearTiles[i].tile.style = bt.config.game.battle.styles.attack;
                                    nearTiles[i].tile.avaliableAction = 'attack';
                                } else if (nearTiles[i].tile.units[bt.model.common.units.definitions.scient].length == 0) {
                                    if  (nearTiles[i].radius <= bt.config.game.battle.actions.moveRadius) {
                                        nearTiles[i].tile.style = bt.config.game.battle.styles.move;
                                        nearTiles[i].tile.avaliableAction = 'move';
                                    }
                                    if ((nearTiles[i] != this.selectedTile) && (nearTiles[i].radius >= minAttackRadius) && ((nearTiles[i].radius <= maxAttackRadius))) {
                                        nearTiles[i].tile.style = (nearTiles[i].tile.style != bt.config.game.battle.styles.move ? bt.config.game.battle.styles.range : bt.config.game.battle.styles.moveInRange);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        // Sets tile as selected
        this._executeActionOnTile = function(battleService, tile) {
            if (tile.avaliableAction) {
                // Get unit
                var unit = this.selectedTile.units[bt.model.common.units.definitions.scient][0]
                if (!unit._pastActions) unit._pastActions = { };
                if (unit) {
                    if (tile.avaliableAction == 'move') {
                        // Check if repeated action in this turn
                        if ((!unit._pastActions.move) || (unit._pastActions.move < bt.game.battle.model.battleField.turnNumber)) {
                            // Execute move action
                            bt.game.battle.battleField.actions.move(battleService, unit, tile);
                            // Register as executed this turn
                            unit._pastActions.move = bt.game.battle.model.battleField.turnNumber
                        } else {
                            // Fire 'repeated action' event
                            bt.game.battle.battleField.RepeatAction.dispatch('move');
                        }
                    } else if (tile.avaliableAction == 'attack') {
                        // Check if repeated action in this turn
                        if ((!unit._pastActions.attack) || (unit._pastActions.attack < bt.game.battle.model.battleField.turnNumber)) {
                            // Execute move action
                            bt.game.battle.battleField.actions.attack(battleService, unit, tile);
                            // Register as executed this turn
                            unit._pastActions.attack = bt.game.battle.model.battleField.turnNumber
                        } else {
                            // Fire 'repeated action' event
                            bt.game.battle.battleField.RepeatAction.dispatch('attack');
                        }
                    }
                }
            }
        };

    },

    battleField : function(obj) {

        // Set base reference
        var base = this;

        // Initialization
        // ---------------------------------------------------------

        // Initialization section
        this.initialState = {

            // Initializes battle field from BattleService.init_state() response
            initialize : function(obj) {
                // Initialize grid
                this._initializeGrid(obj);
                // Initialize graveyard
                this._initializeGraveyard(obj);
                // Initialize units
                this._initializeUnits(obj);
                // Initialize rest
                this._initializeOther(obj);

                // Initialize event handlers
                this._initializeEventHandlers();
            },

            // Initializes battle field's grid from BattleService.init_state() response
            _initializeGrid : function(obj) {
                // Verify grid
                if (bt.debugging.model.verifyModelConstructors) {
                    if ((!angular.isDefined(obj.initial_state)) || (!angular.isDefined(obj.initial_state.grid)) || (!angular.isDefined(obj.initial_state.grid.grid)) || (!angular.isDefined(obj.initial_state.grid.grid.tiles))) console.error(obj, 'Grid object definition incomplete: Missing grid!');
                }
                // Initialize grid object
                base.grid = new bt.model.definitions.battle.grid(obj.initial_state.grid.grid);
                var tiles = obj.initial_state.grid.grid.tiles;
                // Insert tiles
                for (var x = 0; x < base.grid.size.x; x++) {
                    // Verify tiles
                    if (bt.debugging.model.verifyModelConstructors) {
                        if (!tiles[x]) console.error(obj, 'Grid object definition incomplete: Missing "x = ' + x + '" tiles!!');
                    }
                    // Insert tiles
                    for (var y = 0; y < base.grid.size.y; y++) {
                        // Verify tiles
                        if (bt.debugging.model.verifyModelConstructors) {
                            if (!tiles[x][y]) console.error(obj, 'Grid object definition incomplete: Missing "x = ' + x + '" tiles!!');
                        }

                        // Insert tiles
                        var tileDefinition = tiles[x][y].tile;
                        angular.extend(tileDefinition, { location: { x : x , y : y } });
                        var tile = new bt.model.definitions.battle.tile(tileDefinition);
                        base.grid.addTile(tile);

                    }
                }
            },

            // Initializes battle field's graveyard from BattleService.init_state() response
            _initializeGraveyard : function(obj) {
                // Initialize graveyard
                base.graveyard = new bt.model.definitions.battle.graveyard();
            },

            // Initializes battle view's units from BattleService.init_state() response
            _initializeUnits : function(obj) {
                // Verify units
                if (bt.debugging.model.verifyModelConstructors) {
                    if ((!angular.isDefined(obj.initial_state)) || (!angular.isDefined(obj.initial_state.units))) console.error(obj, 'Grid object definition incomplete: Missing grid!');
                }
                // Initialize units collection
                base.units = new bt.model.definitions.battle.unitsCollection();
                // Insert units
                for (var id in obj.initial_state.units) {
                    for (var unitType in bt.model.common.units.definitions) {
                        if (angular.isDefined(obj.initial_state.units[id][bt.model.common.units.definitions[unitType]])) {

                            // Insert unit
                            var unitDefinition = obj.initial_state.units[id][bt.model.common.units.definitions[unitType]];
                            angular.extend(unitDefinition, { id : id });
                            if ((angular.isDefined(obj.initial_state.owners)) && (angular.isDefined(obj.initial_state.owners[id]))) angular.extend(unitDefinition, { owner : obj.initial_state.owners[id] });
                            var unit = new bt.model.definitions.battle[unitType](unitDefinition);
                            base.units.addUnit(unit);

                            // Add to grid or graveyard
                            if (base.grid) base.grid.tilesByX[unit.location.x][unit.location.y].addContent(unit);

                        }
                    }
                }
            },

            // Initializes other properties from BattleService.init_state() response
            _initializeOther : function(obj) {
                // Verify units
                if (bt.debugging.model.verifyModelConstructors) {
                    if ((!angular.isDefined(obj.initial_state)) || (!angular.isDefined(obj.initial_state.player_names))) console.error(obj, 'Initial state definition incomplete: Missing players!');
                }
                // Initialize players
                base.players = obj.initial_state.player_names;
            },

            // Initializes event handlers
            _initializeEventHandlers : function() {
                // Initiailze 'unit dead' event handler
                bt.game.battle.battleField.UnitDead.subscribe(function(event) {
                        base.actions.killUnit(event.unit);
                    });
            }

        }
        this.initialState.initialize(obj);

        // Game status
        // ---------------------------------------------------------

        // Holds currently active player's username
        this.activePlayer = bt.game.authentication.username;

        // Holds current turn number
        this.turnNumber = 0;
        // Holds current action number
        this.actionNumber = 0;
        // Holds game over status
        this.gameOver = false;

        // Battle field functinoality
        // ---------------------------------------------------------

        // Battlefield actions namespace
        this.actions = {

            // Moves unit from grid to graveyard
            killUnit : function(unit) {
                // Remove unit from grid
                if ((base.grid) && (unit.location) && (angular.isNumber(unit.location.x)) && (angular.isNumber(unit.location.y)) && (base.grid.tilesByX[unit.location.x])) {
                    var tile = base.grid.tilesByX[unit.location.x][unit.location.y];
                    if (tile) tile.removeContent(unit);
                }
                // Add content to graveyard
                base.graveyard.addUnit(unit);
            }

        }


    }

}

// Battle view's data model events
// ---------------------------------------------------------------------------------------------------------------------

// @ bt.game.battle.model

// 'Tile selecte' event
bt.events.define(bt.game.battle.battleField, 'TileSelect');
// 'Tile selected' event
bt.events.define(bt.game.battle.battleField, 'TileSelected');

// 'Tile deselecte' event
bt.events.define(bt.game.battle.battleField, 'TileDeselect');
// 'Tile deselected' event
bt.events.define(bt.game.battle.battleField, 'TileDeselected');

// 'Tile action execute' event
bt.events.define(bt.game.battle.battleField, 'TileActionExecute');
// 'Tile action executed' event
bt.events.define(bt.game.battle.battleField, 'TileActionExecuted');

// 'Repeated action' event
bt.events.define(bt.game.battle.battleField, 'RepeatAction');

// 'Unit damage' event
bt.events.define(bt.game.battle.battleField, 'UnitDamage');
// 'Unit dead' event
bt.events.define(bt.game.battle.battleField, 'UnitDead');
