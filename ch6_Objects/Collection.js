class Collection {
  constructor() {
    this.members = [];
  }

  add(element) {
    if (!this.has(element)) { this.members.push(element); }
  }

  delete(element) {
    let index = this.members.indexOf(element);
    if (index != -1) { this.members.splice(index, 1); }
  }

  has(element) {
    return this.members.includes(element);
  }

  static from(iterable) {
    let collection = new Collection;
    for (let element of iterable) { collection.add(element); }
    return collection;
  }
}

let collection = new Collection;

console.log(collection);

collection.add(10);
collection.add(10);

console.log(collection);
console.log(collection.has(10));

collection.delete(10);

console.log(collection);
console.log(collection.has(10));
console.log(collection.has(11));

let collection2 = Collection.from([1,2,3]);
console.log(collection2);
console.log(collection2.has(3));
console.log(collection2.has(4));
