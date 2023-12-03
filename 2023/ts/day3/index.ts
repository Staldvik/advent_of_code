import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

const isDigit = (char: string) => /\d/.test(char);

const checkDirections = (numberPos: [number, number], rows: string[]) => {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  let specialChars = /[`!@#$%^&*()_\-+=\[\]{};':"\\|,<>\/?~ ]/;

  for (const direction of directions) {
    const [x, y] = direction;
    const row = rows[numberPos[0] + x];
    if (row) {
      const char = row[numberPos[1] + y];
      if (specialChars.test(char)) {
        let isGear = char === "*";
        return {
          isSymbol: true,
          isGear,
          gearPos: [numberPos[0] + x, numberPos[1] + y],
        };
      }
    }
  }

  return { isSymbol: false, isGear: false };
};

const part1 = (input: string) => {
  const keptNumbers: number[] = [];
  const rows = input.split("\n");
  for (let row = 0; row < rows.length; row++) {
    let number = "";
    let keepNumber = false;
    for (let column = 0; column < rows[0].length; column++) {
      const char = rows[row][column];
      // Skip if no number is/will be started
      if (!isDigit(char) && !number.length) continue;

      // If it is a digit we should add it to our number
      if (isDigit(char)) {
        number += char;
        // And do a check in all directions for a symbol
        if (!keepNumber) {
          keepNumber = checkDirections([row, column], rows).isSymbol;
        }
      } else if (number.length) {
        if (keepNumber) keptNumbers.push(parseInt(number));
        keepNumber = false;
        number = "";
      }

      if (column === rows[0].length - 1 && number.length && keepNumber) {
        keepNumber = false;
        keptNumbers.push(parseInt(number));
        number = "";
      }
    }
  }

  let sum = 0;
  for (const keptNumber of keptNumbers) {
    sum += keptNumber;
  }

  return sum;
};

const part2 = (input: string) => {
  const gearMap: Map<string, number[]> = new Map();
  const keptNumbers: number[] = [];
  const rows = input.split("\n");
  for (let row = 0; row < rows.length; row++) {
    let number = "";
    let keepNumber = false;
    let connectedToGear = "";
    for (let column = 0; column < rows[0].length; column++) {
      const char = rows[row][column];
      // Skip if no number is/will be started
      if (!isDigit(char) && !number.length) continue;

      // If it is a digit we should add it to our number
      if (isDigit(char)) {
        number += char;
        // And do a check in all directions for a symbol
        if (!keepNumber) {
          const { isGear, isSymbol, gearPos } = checkDirections(
            [row, column],
            rows
          );
          keepNumber = isSymbol;
          if (isGear && gearPos) {
            connectedToGear = gearPos?.join("");
          }
        }
      } else if (number.length) {
        if (keepNumber) {
          keptNumbers.push(parseInt(number));
          if (connectedToGear) {
            gearMap.set(connectedToGear, [
              ...(gearMap.get(connectedToGear) || []),
              parseInt(number),
            ]);
          }
        }
        connectedToGear = "";
        keepNumber = false;
        number = "";
      }

      if (column === rows[0].length - 1 && number.length && keepNumber) {
        keptNumbers.push(parseInt(number));
        if (connectedToGear) {
          gearMap.set(connectedToGear, [
            ...(gearMap.get(connectedToGear) || []),
            parseInt(number),
          ]);
        }
        connectedToGear = "";
        keepNumber = false;
        number = "";
      }
    }
  }

  let sum = 0;

  gearMap.forEach((numbers, gearPos) => {
    if (numbers.length === 2) {
      sum += numbers[0] * numbers[1];
    }
  });

  return sum;
};

// testSolution("4361", part1, testFile);
// testSolution("467835", part2, testFile);

console.log("Part 1:", part1(inputFile));
console.log("Part 2:", part2(inputFile));
