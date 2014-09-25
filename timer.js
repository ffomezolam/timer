/** 
 * @module timer
 */ 
(function(name, context, definition) { 
    if(typeof module !== 'undefined' && module.exports) module.exports = definition(); 
    else if(typeof define === 'function' && define.amd) define([], definition); 
    else context[name] = definition(); 
})('Timer', this, function() {
    function isArray(o) {
        return Object.prototype.toString.call(o) === "[object Array]";
    }

    /**
     * Timer class
     *
     * @class Timer
     * @constructor
     * @param {Number} [interval] Timer interval in milliseconds (default 60)
     */
    function Timer(interval) {
        this._interval = interval || 60;
        this._handle = null;
        this._elapsed = 0;
        this._triggers = null;
    }

    Timer.prototype = {
        /**
         * Start the timer with optional interval override
         *
         * @method start
         * @chainable
         * @param {Number} [i] Optional interval to use
         */
        start: function(i) {
            var that = this;
            this._handle = setInterval( function() {
                that.elapsed++;
                if(that.triggers && that.triggers[that.elapsed]) {
                    var triggers = that.triggers[that.elapsed];
                    // invoke triggers at time, passing time as argument
                    for(var i = 0, l = triggers.length; i < l; i++) {
                        var trigger = triggers[i];
                        if(trigger.context) trigger.func.call(context, that.elapsed);
                        else                trigger.func(that.elapsed);
                    }
                }
            }, i || this._interval );
            return this;
        },

        /**
         * Stop the timer
         *
         * @method stop
         * @chainable
         */
        stop: function() {
            clearInterval(this._handle);
            return this;
        },

        /**
         * Get elapsed time
         *
         * @method get
         * @returns {Number} Elapsed time
         */
        get: function() {
            return this._elapsed;
        },

        /**
         * Set (or reset) elapsed time
         *
         * @method set
         * @chainable
         * @param {Number} [n] Elapsed time
         */
        set: function(n) {
            this._elapsed = n || 0;
            return this;
        },

        /**
         * Trigger a function at a certain time
         *
         * @method addTrigger
         * @chainable
         * @param {Function} callback Function to call
         * @param {Number} time Time at which to call callback
         * @param {Object} [context] Optional context for callback
         */
        addTrigger: function(callback, time, context) {
            if(!callback) return this;
            if(!this._triggers) this._triggers = {};
            time = time || 0;

            if(!this._triggers[time]) this._triggers[time] = [];
            this._triggers[time].push({ func: callback, context: context });
            return this;
        },

        /**
         * Remove trigger(s)
         *
         * @method removeTrigger
         * @chainable
         * @param {Any} arg Time or callback to remove, or array thereof
         */
        removeTrigger: function(arg) {
            if(!this._triggers) return this;
            if(!arguments.length) {
                for(var i in this._triggers) {
                    this.removeTrigger(i);
                }
            } else {
                if(isArray(arg)) {
                    for(var i = 0, l = arg.length; i < l; i++) {
                        this.removeTrigger(arg[i]);
                    }
                } else if(typeof arg == "function") {
                    for(var i in this._triggers) {
                        var toRemove = [];
                        var arr = this._triggers[i];
                        for(var j = 0, l = this._triggers[i].length; j < l; j++) {
                            var func = arr[j].func;
                            if(func === arg) {
                                toRemove.push(j);
                            }
                        }
                        for(var l = toRemove.length, j = l; j >= 0; j--) {
                            arr.splice(toRemove[j], 1);
                        }
                    }
                } else if(this._triggers[arg]) {
                    delete this._triggers[arg];
                }
            }

            return this;
        }
    };

    return Timer;
});
