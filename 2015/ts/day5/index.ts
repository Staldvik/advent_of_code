import * as R from "remeda";
import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

const checkIfNice = (input: string) => {
  const result = {
    hasVowels: false,
    hasDouble: false,
    hasForbiddenStrings: false,
  };

  let vowels = 0;
  let previousChar: string | undefined = undefined;
  for (const char of input.split("")) {
    if (!result.hasVowels && "aeiou".includes(char)) {
      vowels++;
      if (vowels >= 3) result.hasVowels = true;
    }

    if (!result.hasDouble && previousChar === char) {
      result.hasDouble = true;
    }

    if (["ab", "cd", "pq", "xy"].includes(previousChar + char)) {
      result.hasForbiddenStrings = true;
      return false;
    }

    previousChar = char;
  }

  return result.hasVowels && result.hasDouble && !result.hasForbiddenStrings;
};

const part1 = (input: string) => {
  return input.split("\n").reduce((acc, curr) => {
    if (checkIfNice(curr)) return acc + 1;
    return acc;
  }, 0);
};

const newCheck = (input: string) => {
  const chars = input.split("");

  let containsTwoPairs = false;
  let containsRepeat = false;

  for (let index = 1; index < chars.length; index++) {
    const previousChar = chars[index - 1];
    const char = chars[index];
    const nextChar = chars[index + 1];

    const pair = previousChar + char;
    if (input.slice(index + 1).includes(pair)) containsTwoPairs = true;

    if (previousChar === nextChar) containsRepeat = true;
  }

  if (containsTwoPairs && containsRepeat) return true;
  return false;
};

const part2 = (input: string) => {
  return input.split("\n").reduce((acc, curr) => {
    if (newCheck(curr)) return acc + 1;
    return acc;
  }, 0);
};

testSolution("1", part1, testFile);
testSolution("0", part2, testFile);

console.log("Part 1:", part1(inputFile));
console.log("Part 2:", part2(inputFile)); // 106 too high // 52 not right // 77 not right
