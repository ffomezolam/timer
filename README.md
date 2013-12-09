Timer
=========

A timer

Constructor
-----------

`Timer(interval)` Pass the timer interval in milliseconds.

Methods
-------

- `start(i)` Start the timer with optional interval override `i`.
- `stop()` Stop the timer.
- `get()` Get the elapsed time.
- `set(n)` Set the elapsed time. No arguments resets to 0.
- `addTrigger(callback, time, context)` Add function `callback` to be called at `time` with optional `context`.
- `removeTrigger(arg)` Remove trigger by time or callback or array of either.
