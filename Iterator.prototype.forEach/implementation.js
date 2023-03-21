'use strict';

var GetIntrinsic = require('get-intrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Call = require('es-abstract/2022/Call');
var GetIteratorDirect = require('../aos/GetIteratorDirect');
var IsCallable = require('es-abstract/2022/IsCallable');
var IteratorClose = require('../aos/IteratorClose');
var IteratorStep = require('../aos/IteratorStep');
var IteratorValue = require('es-abstract/2022/IteratorValue');
var ThrowCompletion = require('es-abstract/2022/ThrowCompletion');
var Type = require('es-abstract/2022/Type');

module.exports = function forEach(fn) {
	var O = this; // step 1
	if (Type(O) !== 'Object') {
		throw new $TypeError('`this` value must be an Object'); // step 2
	}

	if (!IsCallable(fn)) {
		throw new $TypeError('`fn` must be a function'); // step 3
	}

	var iterated = GetIteratorDirect(O); // step 4

	var counter = 0; // step 5

	// eslint-disable-next-line no-constant-condition
	while (true) { // step 6
		var next = IteratorStep(iterated); // step 6.a
		if (!next) {
			return void undefined; // step 6.b
		}
		var value = IteratorValue(next); // step 6.c
		try {
			Call(fn, void undefined, [value, counter]); // step 6.d
		} catch (e) {
			IteratorClose(
				iterated,
				ThrowCompletion(e)
			); // steps 6.e
			throw e;
		} finally {
			counter += 1; // step 6.f
		}
	}
};
