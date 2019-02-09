// Peristent collection:
// methods add and delete return a new object instead of updating the current one
class PCollection {
  constructor(array) {
    this.members = array;
  }

  add(element) {
    if (this.has(element)) return this;
    else {
      return new PCollection(this.members.concat([element]));
    }
  }

  delete(element) {
    if (!this.has(element)) return this;
    else {
      return new PCollection(this.members.filter(el => el != element));
    }
  }

  has(element) {
    return this.members.includes(element);
  }
}

PCollection.empty = new PCollection([]);


// TESTING
let a = PCollection.empty.add("a");
let ab = a.add("b");
let b = ab.delete("a");

console.log(b.has("b"));
// → true
console.log(a.has("b"));
// → false
console.log(b.has("a"));
// → false
