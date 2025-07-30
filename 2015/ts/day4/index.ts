import { getInputFile, getTestFile, testSolution } from "../utils";
import { createHash } from "node:crypto";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

const part1 = (input: string) => {
  let num = 0;

  while (true) {
    const hash = createHash("md5")
      .update(input + num)
      .digest("hex");

    if (hash.startsWith("00000")) return num;
    num++;
  }
};

const part2 = (input: string) => {
  let num = 0;

  while (true) {
    const hash = createHash("md5")
      .update(input + num)
      .digest("hex");

    if (hash.startsWith("000000")) return num;
    num++;
  }
};

testSolution("609043", part1, testFile);
// testSolution("167409079868000", part2, testFile);

console.log("Part 1:", part1(inputFile));
console.log("Part 2:", part2(inputFile));
