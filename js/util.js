function mod(n, m) {
    return ((n % m) + m) % m;
}

// Returns the rgb components as a comma-separated string.
// E.g. hexToRgb('#ff0000') => '255,0,0'
function hexToRgb(hex) {
    var bigint = parseInt(hex.substring(1), 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return r + "," + g + "," + b;
}

function lerp(a, b, t, easingFunction = Easing.linear) {
    return (a + (b - a) * easingFunction(t));
}

function clamp(x, min, max) {
    var xMin = Math.max(x, min);
    var xMax = Math.min(xMin, max);
    return xMax;
}

// Reverse Array.some()
// Production steps of ECMA-262, Edition 5, 15.4.4.17
// Reference: http://es5.github.io/#x15.4.4.17
if (!Array.prototype.someReverse) {
  Array.prototype.someReverse = function(fun/*, thisArg*/) {
    if (this == null) {
      throw new TypeError('Array.prototype.someReverse called on null or undefined');
    }

    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = len - 1; i >= 0; i--) {
      if (i in t && fun.call(thisArg, t[i], i, t)) {
        return true;
      }
    }

    return false;
  };
}

// Reverse Array.forEach
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEachReverse) {
  Array.prototype.forEachReverse = function(callback, thisArg) {
    var T, k;
    if (this === null) {
      throw new TypeError(' this is null or not defined');
    }
    // 1. Let O be the result of calling toObject() passing the
    // |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get() internal
    // method of O with the argument "length".
    // 3. Let len be toUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If isCallable(callback) is false, throw a TypeError exception. 
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let
    // T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = len - 1;

    // 7. Repeat, while k >= 0
    while (k >= 0) {

      var kValue;

      // a. Let Pk be ToString(k).
      //    This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty
      //    internal method of O with argument Pk.
      //    This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal
        // method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as
        // the this value and argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k--;
    }
    // 8. return undefined
  };
}