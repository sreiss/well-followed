var EventEmitter = require('events'),
    util = require('util');

function SensorValueEmitter() {
    return EventEmitter.call(this);
}
util.inherits(SensorValueEmitter, EventEmitter);

SensorValueEmitter.prototype.value = function(data) {
    this.emit('value', data);
};

module.exports = SensorValueEmitter;