import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

const buildNumberBreakdown = (numbers: number[]) => {
  const numberBreakdown: number[][] = [numbers];
  const recurse = (numbers: number[]) => {
    if (numbers.every((num) => num === 0)) return numbers;
    const diffNums = numbers.flatMap((num, i, arr) => {
      const nextNum = arr.at(i + 1);
      if (nextNum === undefined) return [];
      return nextNum - num;
    });
    numberBreakdown.push(diffNums);
    recurse(diffNums);
  };
  recurse(numbers);
  return numberBreakdown;
};

const getNum = (
  breakDown: number[][],
  left: number,
  i: number,
  depth: number
): number => {
  if (depth === breakDown.length - 1) {
    return left + breakDown[depth].at(-1)!;
  }
  const newLeftNum = breakDown[depth + 1].at(-1)!;
  return left + getNum(breakDown, newLeftNum, i - 1, depth + 1);
};

const part1 = (input: string) => {
  const lines = input.split("\n").map((line) => line.split(" ").map(Number));

  let sum = 0;
  for (const line of lines) {
    const numberBreakdown = buildNumberBreakdown(line);

    sum += getNum(
      numberBreakdown,
      numberBreakdown[0][numberBreakdown[0].length - 1],
      numberBreakdown[0].length - 1,
      0
    );
  }

  return sum;
};

const part2 = (input: string) => {
  const lines = input.split("\n").map((line) => line.split(" ").map(Number));

  let sum = 0;
  for (const line of lines) {
    const numberBreakdown = buildNumberBreakdown(line.toReversed());

    sum += getNum(
      numberBreakdown,
      numberBreakdown[0][numberBreakdown[0].length - 1],
      numberBreakdown[0].length - 1,
      0
    );
  }

  return sum;
};

testSolution("114", part1, testFile);
testSolution("2", part2, testFile);

console.log("Part 1:", part1(inputFile));
console.log("Part 2:", part2(inputFile));
