function range(start, end, step = 1) {
  /* returns an array of nubers from start (integer) included to end (integer)
  excluded in steps of step units */
  let range = [];
  if ((step == 0) || (start < end && step < 0) || (start > end && step > 0)) {
    console.log("invalid parameters");
    return null;
  }
  if (step > 0) {
    while (start <= end) {
      range.push(start);
      start += step;
    }
    return range;
  } else {
    while (start >= end) {
      range.push(start);
      start += step;
    }
    return range;
  }
}

// console.log(range(10, 1, -3));

function sum(arr) {
  // takes an array of numbers and returns the sum of all elements
  sum = 0;
  for (num of arr) sum += num;
  return sum;
}

// console.log(sum(range(1,10)));


function reverseArray(arr) {
  // takes an array and returns a new array with elements in reverse order
  let reverse = [];
  for (value of arr) reverse.push(value);
  return reverse;
}

function reverseArrayInPlace(arr) {
  // takes an array and returns the same array with elements in reverse order
  for (let i = 0; i < arr.length / 2; ++i){
    let temp = arr[i];
    arr[i] = arr[arr.length -i-1];
    arr[arr.length -i-1] = temp;
  }
  return arr;
}

// let x = [1,2,3,4];
// console.log(reverseArray(x));
// console.log( x == reverseArray(x));
//
// console.log(reverseArrayInPlace(x));
// console.log( x == reverseArrayInPlace(x));


function arrayToList(arr) {
  // takes an array and returns a list with the same elements
  if (arr.length == 0) return null;
  else if (arr.length == 1) return {value: arr[0], rest: null};
  else return {value: arr[0], rest: arrayToList(arr.slice(1))};
}


function listToArray(list) {
  // takes a list and returns an array with the same elements
  let arr = [];
  for (let node = list; node; node = node.rest) {
    arr.push(node.value);
  }
  return arr;
}

function prepend(value, list) {
  // takes an element and a list. Adds the element in front of the list.
  return {value, rest: list};
}

function nth(n, list) {
  // takes a position n (positive integer) and a list. Returns the the value at
  // the nth position in the list of undefined if no value exists
  for (let i=0; i<n; ++i) {
    if (!list) return undefined;
    list = list.rest;
  }
  if (!list) return undefined;
  else return list.value;
}

function nthRecursive(n, list) {
  // takes a position n (positive integer) and a list. Returns the the value at
  // the nth position in the list of undefined if no value exists
  if (!list) return undefined;
  else if (n==0) return list.value;
  else return nthRecursive(n-1, list.rest);
}


// list = arrayToList([1,2,3]);
// console.log(list);
// // console.log(listToArray(list));
// // console.log(prepend(0, list));
// console.log(nthRecursive(1,list));


function deepEqual(a, b) {
  // takes 2 values and returns true of they are the same value or they are two
  // objects with the same properties where the values of the properties are
  // equal when compared with a recursive call of deepEqual
  if (a === b) return true;
  else if (typeof a != "object" || typeof b != "object") return false;
  // both objects, compare properties
  else {
    let keysA = Object.keys(a), keysB = Object.keys(b);
    if (keysA.length != keysB.length) return false;
    for (let key in keysA) {
      if (!keysB.includes(key) || !deepEqual(a[key],b[key])) return false;
    }
    return true;
  }
}

console.log(deepEqual([2,1],[2]));
