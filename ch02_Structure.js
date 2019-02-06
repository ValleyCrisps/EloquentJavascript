function triangle(num) {
  // Prints a triangle of "#" with "num" rows.
  for (let row = ""; row.length <= num; row += "#"){
    console.log(row);
  }
}

// triangle(7);

function chessboard(size) {
  // Prints a chessboard of size "size" x "size"
  for (let i = 0; i < size; ++i) {
    row = "";
    for (let j = 0; j < size; ++j) {
      if ((i + j) % 2) {
        row += "#";
      } else {
        row += " ";
      }
    }
    console.log(row);
  }
}

// chessboard(8);
