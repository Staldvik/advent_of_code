import { getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);

const part1 = (input: string) => {
  return input.split("\n").reduce(
    ({ increasedTimes, previousDepth }, currentLine) => {
      const currentDepth = parseInt(currentLine, 10);
      const newIncreasedTimes =
        previousDepth && currentDepth > previousDepth
          ? increasedTimes + 1
          : increasedTimes;
      return { increasedTimes: newIncreasedTimes, previousDepth: currentDepth };
    },
    { increasedTimes: 0, previousDepth: 0 }
  ).increasedTimes;
};

testSolution("7", part1, testFile);
