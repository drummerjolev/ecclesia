'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bnToAccumulator = exports.accumulatorToBn = exports.bnToString = undefined;

var _bn = require('bn.js');

var _bn2 = _interopRequireDefault(_bn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bnToString = exports.bnToString = function bnToString(bn) {
  return bn.toString(10, 1000).replace(/^0+/, '');
};

var accumulatorToBn = exports.accumulatorToBn = function accumulatorToBn(accumulator, numLimbs) {
  var newBN = new _bn2.default(accumulator[0].toString(16), 16);
  for (var i = 1; i < numLimbs; i += 1) {
    newBN.iushln(256);
    var limb = new _bn2.default(accumulator[i].toString(16), 16);
    newBN.iadd(limb);
  }
  return newBN;
};

var bnToAccumulator = exports.bnToAccumulator = function bnToAccumulator(bn, numLimbs) {
  var newBN = bn.clone();
  var reversedAccumulator = [];
  var modulus = new _bn2.default(1).iushln(256);
  var limb = newBN.umod(modulus);
  reversedAccumulator.push(limb);
  for (var i = 1; i < numLimbs; i += 1) {
    newBN.iushrn(256);
    limb = newBN.umod(modulus);
    reversedAccumulator.push(limb);
  }
  return reversedAccumulator.reverse();
};