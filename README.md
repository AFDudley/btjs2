# Binary Tactics: Client-Side implementation #2

## Debugging options

### Events

To control if all raised events are to be published to console toggle property:
```javascript
bt.debugging.events.publishToConsole = true | false;
```

To set if model-view objects check received structure when initializing toggle property:
```javascript
bt.debugging.model.verifyModelConstructors = true | false
```




## Service calls stress testing:

The 'debugging view' allows for stress testing with supported service calls. Select service's method to call, set the interval at witch to call it and you get statistics of successfull, failed and error calls in real time ...




## Service calls syntax from console:

### Reinitialize battle view's view-model:
```javascript
    bt.services.execute('BattleService', function(service) { service.initialization.initialize(); });
```

### Update battle view's view-model:
```javascript
    bt.services.execute('BattleService', function(service) { bt.game.battle.battleField.update(service) });
```

### Update battle view's timers:
```javascript
    bt.services.execute('BattleService', function(service) { bt.game.battle.timers.query(service) });
```


### Perform action - Pass turn:
```javascript
    bt.services.execute('BattleService', function(service) { service.actions.pass(); });
```

### Perform action - Move unit:
```javascript
    var unitId = 0, location = { x: 0, y: 0}; // Set these variables to appropriate values
    bt.services.execute('BattleService', function(service) { service.actions.move(unitId, location); });
```

### Perform action - Attack unit:
```javascript
    var unitId = 0, location = { x: 0, y: 0}; // Set these variables to appropriate values
    bt.services.execute('BattleService', function(service) { service.actions.attack(unitId, location); });
```