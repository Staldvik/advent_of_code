import fs from "fs";

const text = fs.readFileSync(new URL("./input.txt", import.meta.url), "utf8");

const task1 = () => {
  const buffer = [];
  for (let i = 0; i < text.length; i += 1) {
    buffer.push(text[i]);
    if (buffer.length !== 4) {
      continue;
    }

    const unique = buffer.every((letter, index, array) => {
      return array.indexOf(letter) === index;
    });

    if (unique) return i + 1;

    buffer.shift();
  }
};

const task2 = () => {
  const buffer = [];
  for (let i = 0; i < text.length; i++) {
    buffer.push(text[i]);
    if (buffer.length !== 14) {
      continue;
    }

    const unique = buffer.every((letter, index, array) => {
      return array.indexOf(letter) === index;
    });

    if (unique) return i + 1;

    buffer.shift();
  }
};

const findStartOfSequence = (messageLength) => {
  for (let i = messageLength; i < text.length; i++) {
    const allDistinct =
      new Set(text.substring(i - messageLength, i)).size === messageLength;
    if (allDistinct) return i;
  }
};

console.log("Task1    :", task1());
console.log("Task2    :", task2());

console.log("Task1 v2 :", findStartOfSequence(4));
console.log("Task2 v2 :", findStartOfSequence(14));
