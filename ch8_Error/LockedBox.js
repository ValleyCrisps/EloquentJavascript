const box = {
  locked: true,
  unlock() { this.locked = false; },
  lock() { this.locked = true; },
  _content: [],
  get content() {
    if (this.locked) throw new Error("Locked!");
    return this._content;
  }
};

// unlocks the box, runs body and lock the box again if it was originally locked
// regardless of whether the argument function returned normally or threw an exception.
// (function) -> any
function withBoxUnlocked(body) {
  let locked = box.locked;
  box.unlock();
  try {
    return body();
  } finally {
    if (locked) { box.lock(); }
  }
}

withBoxUnlocked(function() {
  box.content.push("gold piece");
});

try {
  withBoxUnlocked(function() {
    throw new Error("Pirates on the horizon! Abort!");
  });
} catch(e) {
  console.log("Error raised: ", e);
}
console.log(box.locked);
