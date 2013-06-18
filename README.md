# Binary Tactics: Client-Side implementation #2




## Implemented tests:

### Testing BattleService.initial_state() call and conversion into the view-model

First get initial state into the view-model either with selecting the Battle view or from console with:
```javascript
    bt.game.battle.model.initialization.initialize();
```

And then you can inspect the initialized view-model's battleField object with:
```javascript
    console.log( bt.game.battle.model.battleField );
```




## Currently testable service calls - console syntax:

### Authentication service (hooked into view model, will have UI manifestation)

```javascript
    bt.services.execute('authService', function(service) {
                                            service.authenticate( 'atkr', 'atkr2', function() { alert("Success"); }, function() { alert("Fail!"); } );
                                        });
```

### Battle service (not hooked to view model, will not have UI manifestation)

```javascript
    bt.services.execute('BattleService', function(service) {
                                            service.calls.getUsername(
                                                                function(data) { console.log("Success:"); console.log(data); },
                                                                function(data) { console.log("Fail:"); console.log(data); }
                                                            );
                                        });
    bt.services.execute('BattleService', function(service) {
                                            service.calls.timeLeft(
                                                                function(data) { console.log("Success:"); console.log(data); },
                                                                function(data) { console.log("Fail:"); console.log(data); }
                                                            );
                                        });
    bt.services.execute('BattleService', function(service) {
                                            service.calls.initialState(
                                                                function(data) { console.log("Success:"); console.log(data); },
                                                                function(data) { console.log("Fail:"); console.log(data); }
                                                            );
                                        });
    bt.services.execute('BattleService', function(service) {
                                            service.calls.lastResult(
                                                                function(data) { console.log("Success:"); console.log(data); },
                                                                function(data) { console.log("Fail:"); console.log(data); }
                                                            );
                                        });
    bt.services.execute('BattleService', function(service) {
                                            service.calls.getStates(
                                                                function(data) { console.log("Success:"); console.log(data); },
                                                                function(data) { console.log("Fail:"); console.log(data); }
                                                            );
                                        });
    bt.services.execute('BattleService', function(service) {
                                            service.calls.getLastState(
                                                                function(data) { console.log("Success:"); console.log(data); },
                                                                function(data) { console.log("Fail:"); console.log(data); }
                                                            );
                                        });
    bt.services.execute('BattleService', function(service) {
                                            service.calls.processAction(
                                                                'action type',
                                                                function(data) { console.log("Success:"); console.log(data); },
                                                                function(data) { console.log("Fail:"); console.log(data); }
                                                            );
                                        });
```




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

