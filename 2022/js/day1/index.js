import fs from "fs";

const text = fs.readFileSync(new URL("./input.txt", import.meta.url), "utf8");

let top3 = [0, 0, 0];
let currentElf = 0;
text.split("\n").forEach((row) => {
  if (row === "") {
    if (top3.some((topElf) => topElf < currentElf)) {
      top3 = [...top3, currentElf].sort((a, b) => b - a).slice(0, 3);
    }
    currentElf = 0;
  } else {
    currentElf += Number(row);
  }
});

console.log("Max:", top3[0]);
console.log("Top 3 summed:", top3[0] + top3[1] + top3[2]);
