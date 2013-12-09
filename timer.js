/** 
 * @module Timer
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
        this.interval = interval || 60;
        this.handle = null;
        this.elapsed = 0;
        this.triggers = null;
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
            this.handle = setInterval( function() {
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
            }, i || this.interval );
            return this;
        },

        /**
         * Stop the timer
         *
         * @method stop
         * @chainable
         */
        stop: function() {
            clearInterval(this.handle);
            return this;
        },

        /**
         * Get elapsed time
         *
         * @method get
         * @returns {Number} Elapsed time
         */
        get: function() {
            return this.elapsed;
        },

        /**
         * Set (or reset) elapsed time
         *
         * @method set
         * @chainable
         * @param {Number} [n] Elapsed time
         */
        set: function(n) {
            this.elapsed = n || 0;
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
            if(!this.triggers) this.triggers = {};
            time = time || 0;

            if(!this.triggers[time]) this.triggers[time] = [];
            this.triggers[time].push({ func: callback, context: context });
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
            if(!this.triggers) return this;
            console.log('deleting', arg);
            if(!arguments.length) {
                for(var i in this.triggers) {
                    this.removeTrigger(i);
                }
            } else {
                console.log('arg', arg, typeof arg);
                if(isArray(arg)) {
                    for(var i = 0, l = arg.length; i < l; i++) {
                        this.removeTrigger(arg[i]);
                    }
                } else if(typeof arg == "function") {
                    for(var i in this.triggers) {
                        var toRemove = [];
                        var arr = this.triggers[i];
                        for(var j = 0, l = this.triggers[i].length; j < l; j++) {
                            var func = arr[j].func;
                            if(func === arg) {
                                toRemove.push(j);
                            }
                        }
                        for(var l = toRemove.length, j = l; j >= 0; j--) {
                            arr.splice(toRemove[j], 1);
                        }
                    }
                } else if(this.triggers[arg]) {
                    console.log("number");
                    delete this.triggers[arg];
                }
            }

            return this;
        }
    };

    return Timer;
});
