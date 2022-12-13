import fs from "fs";

const text = fs.readFileSync(new URL("./input.txt", import.meta.url), "utf8");
const lowerCaseAlphabet = "abcdefghijklmnopqrstuvwxyz";
const upperCaseAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const getCharacterScore = (character) => {
  const isLowerCase = lowerCaseAlphabet.includes(character);
  const score = isLowerCase
    ? lowerCaseAlphabet.indexOf(character) + 1
    : upperCaseAlphabet.indexOf(character) + 27;
  return score;
};

const task1 = () => {
  let sum = 0;
  text.split("\n").forEach((backpack) => {
    const firstHalf = backpack.slice(0, backpack.length / 2);
    const secondHalf = backpack.slice(backpack.length / 2);

    let firstCommonCharacter;
    for (let i = 0; i < firstHalf.length; i++) {
      if (secondHalf.includes(firstHalf[i])) {
        firstCommonCharacter = firstHalf[i];
        break;
      }
    }

    sum += getCharacterScore(firstCommonCharacter);
  });
  return sum;
};

const task2 = () => {
  let sum = 0;
  const elfs = text.split("\n");

  // For each 3 elfs
  for (let i = 0; i < elfs.length; i += 3) {
    const firstElf = elfs[i];
    const secondElf = elfs[i + 1];
    const thirdElf = elfs[i + 2];

    let firstCommonCharacter;
    for (let j = 0; j < firstElf.length; j++) {
      if (secondElf.includes(firstElf[j]) && thirdElf.includes(firstElf[j])) {
        firstCommonCharacter = firstElf[j];
        break;
      }
    }
    sum += getCharacterScore(firstCommonCharacter);
  }
  return sum;
};

console.log("Task1:", task1());
console.log("Task2:", task2());
