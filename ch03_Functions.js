function pathFinder(target, start=1, history="1"){
  // returns a way to reach a given number (target) starting from "start" and
  // either multiplying but 3 or adding 5 at each step
  if (start === target) {
    return history;
  } else if (start > target) {
    return null;
  } else {
    return pathFinder(target, start*3, `(${ history } * 3)`) || pathFinder(
      target, start+5, `(${ history } + 5)`);
  }
}

// console.log(pathFinder(13));

function min(x, y){
  // return the minimum of two numbers "x" and "y"
  if (x <= y) return x;
  else return y;
}

// console.log(min(-1,0));

function isEven(n) {
  // recursive evenness check for an integer "n"
  if (remainder2(Math.abs(n)) === 0) console.log(`${n} is even`);
  else console.log(`${n} is odd`);
}

function remainder2(n) {
  // returns the remainder of a positive integer "n" modulo 2 (recursive)
  if(n === 0) return 0;
  else if (n === 1) return 1;
  else return remainder2(n-2);
}

// isEven(-1);

function countLetters(str, ch) {
  // return the number of occurrencies of the letter "ch" in the string "str"
  count = 0;
  for (let i = 0; i < str.length; ++i) {
    if (str[i] === ch) count++;
  }
  return count;
}

console.log(countLetters("Banana", "B"));
