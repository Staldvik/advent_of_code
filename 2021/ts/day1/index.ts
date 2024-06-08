import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

const part1 = (input: string) => {
  const { increasedTimes } = input.split("\n").reduce(
    (acc, currentLine) => {
      const currentDepth = parseInt(currentLine, 10);
      const newIncreasedTimes =
        acc.previousDepth && currentDepth > acc.previousDepth
          ? acc.increasedTimes + 1
          : acc.increasedTimes;
      acc.increasedTimes = newIncreasedTimes;
      acc.previousDepth = currentDepth;
      return acc;
    },
    { increasedTimes: 0, previousDepth: 0 }
  );

  return increasedTimes;
};

const part2 = (input: string) => {
  const { increasedTimes } = input.split("\n").reduce(
    (acc, currentLine, i, arr) => {
      const window = arr
        .slice(i, i + 3)
        .reduce((sum, c) => sum + parseInt(c, 10), 0);

      const newIncreasedTimes =
        acc.window && window > acc.window
          ? acc.increasedTimes + 1
          : acc.increasedTimes;
      acc.increasedTimes = newIncreasedTimes;
      acc.window = window;
      return acc;
    },
    { increasedTimes: 0, window: 0 }
  );

  return increasedTimes;
};

testSolution("7", part1, testFile);
testSolution("1557", part1, inputFile);

testSolution("5", part2, testFile);
testSolution("1608", part2, inputFile);
