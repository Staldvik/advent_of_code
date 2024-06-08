import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

type Result = {
  depth: number;
  length: number;
};

const part1 = (input: string) => {
  const position = input.split("\n").reduce<Result>(
    (pos, curr) => {
      const [direction, amountStr] = curr.split(" ");
      const amount = parseInt(amountStr, 10);
      switch (direction) {
        case "forward":
          pos.length += amount;
          return pos;
        case "up":
          pos.depth -= amount;
          return pos;
        case "down":
          pos.depth += amount;
          return pos;
        default:
          throw new Error(`Unknown direction ${direction}`);
      }
    },
    { length: 0, depth: 0 }
  );

  return position.length * position.depth;
};

type Part2Result = {
  depth: number;
  length: number;
  aim: number;
};

const part2 = (input: string) => {
  const position = input.split("\n").reduce<Part2Result>(
    (pos, curr) => {
      const [direction, amountStr] = curr.split(" ");
      const amount = parseInt(amountStr, 10);
      switch (direction) {
        case "forward":
          pos.length += amount;
          pos.depth += pos.aim * amount;
          return pos;
        case "up":
          pos.aim -= amount;
          return pos;
        case "down":
          pos.aim += amount;
          return pos;
        default:
          throw new Error(`Unknown direction ${direction}`);
      }
    },
    { length: 0, depth: 0, aim: 0 }
  );

  return position.length * position.depth;
};

testSolution("150", part1, testFile);
testSolution("1636725", part1, inputFile);

testSolution("900", part2, testFile);
testSolution("1872757425", part2, inputFile);
