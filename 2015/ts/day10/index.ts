import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

function count(sequence: string) {
  let result = "";
  let prev = "";
  let currentSum = 0;
  for (let index = 0; index <= sequence.length; index++) {
    const char = sequence[index];
    currentSum++;
    if (!prev) {
      prev = char;
      continue;
    }
    if (char === prev) continue;

    if ((char && char !== prev) || index === sequence.length) {
      result += (currentSum - 1).toString() + prev;
    }

    currentSum = 1;
    prev = char;
  }
  return result;
}

const part1 = (input: string) => {
  let result = input;
  for (let i = 0; i < 40; i++) {
    result = count(result);
  }
  return result.length;
};

const part2 = (input: string) => {
  let result = input;
  for (let i = 0; i < 50; i++) {
    result = count(result);
  }
  return result.length;
};

testSolution("", part1, testFile);
// testSolution("", part2, testFile);

console.log("Part 1:", part1(inputFile));
console.log("Part 2:", part2(inputFile));
