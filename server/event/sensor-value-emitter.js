var EventEmitter = require('events'),
    util = require('util');

function SensorValueEmitter() {
    EventEmitter.call(this);
}
util.inherits(SensorValueEmitter, EventEmitter);

SensorValueEmitter.prototype.value = function(data) {
    this.emit('value', data);
};

module.exports = SensorValueEmitter;