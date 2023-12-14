import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

function generateCombinations(
  str: string,
  n: number,
  result: string[] = [],
  combinations: string[][] = []
): string[][] {
  if (n === 1) {
    result.push(str);
    combinations.push([...result]);
    result.pop();
  } else {
    for (let i = 1; i < str.length; i++) {
      result.push(str.substring(0, i));
      generateCombinations(str.substring(i), n - 1, result, combinations);
      result.pop();
    }
  }
  return combinations;
}

const part1 = (input: string) => {
  const lines = input.split("\n");

  for (const line of lines) {
    const [springLine, recordLine] = line.split(" ");

    const springBlocks = springLine.split(".").filter(Boolean);
    const brokenBlocks = recordLine.split(",").map(Number);

    const possibleCombinations = [];

    const result = generateCombinations(
      springBlocks.join(""),
      brokenBlocks.length
    ).filter((c) => {
      for (let i = 0; i < brokenBlocks.length; i++) {
        const blockLength = brokenBlocks[i];
        if (c[i].length < blockLength) return false;
      }
      return true;
    });

    possibleCombinations.push(result);

    const solve = (springBlock: string, mustHave: number) => {};
  }
};

testSolution("21", part1, testFile);
// testSolution("21", part2, testFile);

// console.log("Part 1:", solve(1)(inputFile));
// console.log("Part 2:", solve(1_000_000)(inputFile));
