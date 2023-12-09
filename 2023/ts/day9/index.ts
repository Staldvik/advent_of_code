import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

const parseMap = (map: string) => {};

const part1 = (input: string) => {
  const lines = input.split("\n").map((line) => line.split(" ").map(Number));

  let sum = 0;
  for (const line of lines) {
    const test: number[][] = [line];
    const recurse = (numbers: number[]) => {
      if (numbers.every((num) => num === 0)) return numbers;
      const diffNums = numbers.flatMap((num, i, arr) => {
        const nextNum = arr.at(i + 1);
        if (nextNum === undefined) return [];
        const diff = nextNum - num;
        return diff;
      });
      test.push(diffNums);
      recurse(diffNums);
    };
    recurse(line);

    const getNum = (i: number, left: number, depth: number): number => {
      console.log({ i, left, depth });
      if (depth === test.length - 1) {
        return left + test[depth].at(-1)!;
      }
      const newLeftNum = test[depth + 1].at(-1)!;
      return left + getNum(i - 1, newLeftNum, depth + 1);
    };

    sum += getNum(test[0].length - 1, test[0][test[0].length - 1], 0);
  }

  return sum;
};

const part2 = (input: string) => {
  const lines = input.split("\n").map((line) => line.split(" ").map(Number));

  let sum = 0;
  for (const line of lines) {
    const test: number[][] = [line];
    const recurse = (numbers: number[]) => {
      if (numbers.every((num) => num === 0)) return numbers;
      const diffNums = numbers.flatMap((num, i, arr) => {
        const nextNum = arr.at(i + 1);
        if (nextNum === undefined) return [];
        const diff = nextNum - num;
        return diff;
      });
      test.push(diffNums);
      recurse(diffNums);
    };
    recurse(line);

    const getNum = (i: number, right: number, depth: number): number => {
      console.log({ i, right, depth });
      if (depth === test.length - 1) {
        return right - test[depth].at(0)!;
      }
      const newRightNum = test[depth + 1].at(0)!;
      return right - getNum(i - 1, newRightNum, depth + 1);
    };

    sum += getNum(0, test[0][0], 0);
  }

  return sum;
};

// testSolution("114", part1, testFile);
testSolution("2", part2, testFile);

// console.log("Part 1:", part1(inputFile));
console.log("Part 2:", part2(inputFile));
