'use strict';

var GetIntrinsic = require('get-intrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Call = require('es-abstract/2022/Call');
var IsCallable = require('es-abstract/2022/IsCallable');
var IteratorClose = require('es-abstract/2022/IteratorClose');
var IteratorStep = require('es-abstract/2022/IteratorStep');
var IteratorValue = require('es-abstract/2022/IteratorValue');

var GetIteratorDirect = require('../aos/GetIteratorDirect');
var CreateIteratorFromClosure = require('../aos/CreateIteratorFromClosure');

var iterHelperProto = require('../IteratorHelperPrototype');

var SLOT = require('internal-slot');

module.exports = function map(mapper) {
	var iterated = GetIteratorDirect(this); // step 1

	if (!IsCallable(mapper)) {
		throw new $TypeError('`mapper` must be a function'); // step 2
	}

	var sentinel = {};
	var counter = 0; // step 3.a
	var closure = function () {
		// while (true) { // step 3.b
		var next = IteratorStep(iterated['[[Iterator]]']); // step 3.b.i
		if (!next) {
			// return void undefined; // step 3.b.ii
			return sentinel;
		}
		var value = IteratorValue(next); // step 3.b.iii
		var mapped;
		try {
			mapped = Call(mapper, void undefined, [value, counter]); // step 3.b.iv
			// yield mapped // step 3.b.vi
			return mapped;
		} catch (e) {
			// close iterator // step 3.b.v, 3.b.vii
			IteratorClose(
				iterated['[[Iterator]]'],
				function () { throw e; }
			);
			throw e;
		} finally {
			counter += 1; // step 3.b.viii
		}
		// }
	};
	SLOT.set(closure, '[[Sentinel]]', sentinel); // for the userland implementation

	return CreateIteratorFromClosure(closure, 'Iterator Helper', iterHelperProto); // step 4
};
