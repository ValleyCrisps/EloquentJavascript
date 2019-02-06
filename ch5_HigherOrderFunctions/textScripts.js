require('./scripts.js');

function charScript(charCode) {
  // takes a character code and returns the script it belongs to, if any
  for (let script of SCRIPTS) {
    if (script.ranges.some(([from, to]) => {
      return charCode >= from && charCode < to;
    })) {
      return script;
    }
  }
  return null;
}

// console.log(charScript(1021));


function countBy(items, groupName) {
  /*
  Takes a collection and a function that computes a group name for a given
  element. Returns an array of objects of type:
  {groupname: number of elements in group}
  */
  let counts = [];
  for (let item of items) {
    let name = groupName(item);
    let known = counts.findIndex(c => c.name == name);
    if (known == -1) counts.push({name, count: 1});
    else counts[known].count++;
  }
  return counts;
}

// console.log(countBy([0, -1, 4], n => n>0));


function textScripts(text) {
  // Given a piece of text, it identifies the scripts being used, if any
  let scripts = countBy(text, char => {
    // "codePointAt(0)" takes a character and returns its code
    let script = charScript(char.codePointAt(0));
    return script ? script.name : "none";
  });
  return scripts;
}

// console.log(textScripts("sono io? もしもし誰ですか？"));


function textScriptsPercentage(text) {
  let scripts = textScripts(text);
  let total = scripts.reduce((n, {count}) => n + count, 0);
  if (total == 0) return "No scripts found";

  return scripts.map(({name, count}) => `${Math.floor((count / total)*100)}%: ${name}`);
}

// console.log(textScriptsPercentage("sono io? もしもし誰ですか？"));


function dominantWritingDirection(text) {
  // takes a piece of text and returns the writing direction of a majority of
  // the characters
  // count total occurrencies of any direction
  let scripts = countBy(text, char => {
    let script = charScript(char.codePointAt(0));
    return script ? script.direction : "none";
  });
  // find maximum (excluding "none")
  scripts = scripts.filter(script => script.name != "none");
  let mostCommonDirection = {name: "none", count: 0};
  for (script of scripts) {
    if(script.count > mostCommonDirection.count) {
      mostCommonDirection = script;
    }
  }
  return mostCommonDirection.name;
}

console.log(dominantWritingDirection("sono io? もしもし誰ですか？"));
console.log(dominantWritingDirection("Hey, مساء الخير"));
