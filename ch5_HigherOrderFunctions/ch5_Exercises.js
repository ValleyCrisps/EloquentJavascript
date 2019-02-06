function flatten(array) {
  // use reduce and concat methods to flatten an array of arrays into a single
  // array containing all elements
  return array.reduce((flatArray, subArray) => flatArray.concat(subArray), []);
  // let flatArray = [];
  // array.forEach(subArray => {flatArray = flatArray.concat(subArray)});
  // return flatArray;
}

// console.log(flatten([[1],[2,3],[]]));


function genericLoop(init, test, update, body) {
  for(let i = init; test(i); i = update(i)) {
    body(i);
  }
}

//genericLoop(3, n => n > 0, n => n - 1, console.log);


function every(array, test) {
  // takes an array and a function. Returns true when the given function is true
  // for every element in the array
  for (var i = 0; i < array.length && test(array[i]); ++i) {}
  return i == array.length;
}

function everyAlternative(array, test) {
  // takes an array and a function. Returns true when the given function is true
  // for every element in the array
  return !array.some(element => !test(element));
}

console.log(every([1,2,-3], n => n > 0));
console.log(everyAlternative([1,2,-3], n => n > 0));
