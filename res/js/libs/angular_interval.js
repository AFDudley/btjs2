angular.module('angular-interval', []);
//
// Interval for angular js.
//
var interval = angular.module('angular-interval', []).factory("$interval", function($timeout) {

    // Factory base reference
    var intervalBase = this;

    // Sets a new interval action
    this.set = function(name, fn, interval) {
        intervalBase._intervals[name] = {
                name : name,
                fn : fn,
                interval : interval,
                run : true
            };
    };
    // Clears an interval action
    this.clear = function(name) {
        delete intervalBase._intervals[name];
    }
    // Starts an interval action
    this.start = function(name, starting) {
        if (intervalBase._intervals[name])  {
            if (!starting) {
                intervalBase._intervals[name].run = true;
                intervalBase._intervals[name].fn();
            }
            if (intervalBase._intervals[name].run) {
                $timeout(intervalBase._intervals[name].fn, intervalBase._intervals[name].interval)
                        .then( function() { intervalBase.start(name, true); } );
            }
        }
    }
    // Stops an interval action
    this.stop = function(name) {
        intervalBase._intervals[name].run = false;
    }

    // Holds references to interval actions
    this._intervals = { };

    // Return $interval service
    return this;

});
