import * as R from "remeda";
import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

const part1 = (input: string) => {
  const lines = input.split("\n");
  let sum = 0;
  for (const line of lines) {
    const codeLength = line.length;

    let inMemory = line.slice(1, -1).toString();
    inMemory = inMemory.replaceAll(
      /\\x([0-9a-fA-F]{2})/g,
      (fullMatch, hexCode) => String.fromCharCode(parseInt(hexCode, 16))
    );
    inMemory = inMemory.replaceAll('\\"', '"');
    inMemory = inMemory.replaceAll("\\\\", "\\");

    sum += codeLength - inMemory.length;
  }
  return sum;
};

const part2 = (input: string) => {
  const lines = input.split("\n");
  let sum = 0;
  for (const line of lines) {
    const codeLength = line.length;

    let encoded = line.replaceAll("\\", "\\\\");
    encoded = encoded.replaceAll('"', '\\"');
    encoded = `"${encoded}"`;

    sum += encoded.length - codeLength;
  }
  return sum;
};

testSolution("12", part1, testFile);
testSolution("", part2, testFile);

console.log("Part 1:", part1(inputFile));
console.log("Part 2:", part2(inputFile)); // 1593 too low, 2355 too high, 1974 too low
