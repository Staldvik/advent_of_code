import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

const part1 = (input: string) => {
  const lines = input.split("\n");
  let sum = 0;
  for (const line of lines) {
    const numbers = line.split("");
    const firstNum = numbers.find((char) => !isNaN(parseInt(char)));
    const lastNum = numbers.reverse().find((char) => !isNaN(parseInt(char)));
    const number = parseInt(`${firstNum}${lastNum}`);

    sum += number;
  }

  return sum;
};

const wordDigits: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const findFirstNum = (line: string) => {
  let foundChars = "";

  for (let i = 0; i < line.length; i++) {
    let char = line[i];
    foundChars += char;
    if (!isNaN(parseInt(char!))) return char;

    const foundWordDigit = Object.entries(wordDigits).find(([wordDigit]) =>
      foundChars.includes(wordDigit)
    );
    if (foundWordDigit) return foundWordDigit[1];
  }
};

const findLastNum = (line: string) => {
  let foundChars = "";

  for (let i = line.length - 1; i >= 0; i--) {
    let char = line[i];
    foundChars = `${char}${foundChars}`;

    if (!isNaN(parseInt(char!))) return char;

    const foundWordDigit = Object.entries(wordDigits).find(([wordDigit]) =>
      foundChars.includes(wordDigit)
    );
    if (foundWordDigit) return foundWordDigit[1];
  }
};

const part2 = (input: string) => {
  const lines = input.split("\n");

  let sum = 0;
  for (const line of lines) {
    const firstNum = findFirstNum(line);
    const lastNum = findLastNum(line);
    const number = `${firstNum}${lastNum}`;
    sum += parseInt(number);
  }

  return sum;
};

testSolution("142", part1, testFile);
testSolution("281", part2, testFile);

// console.log("Part 1:", part1(inputFile));
console.log("Part 2:", part2(inputFile));
