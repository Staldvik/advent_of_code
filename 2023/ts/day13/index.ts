import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

const columnToLine = (lines: string[], colI: number) =>
  lines.map((l) => l[colI]).join("");

const findRowI = (pattern: string, allowSmudge = false) => {
  const lines = pattern.split("\n");
  for (let rowI = 0; rowI < lines.length; rowI++) {
    const above = lines.at(rowI);
    const below = lines.at(rowI + 1);
    if (above !== below) continue;
    let matches = true;
    let offset = 1;
    while (true) {
      if (rowI - offset < 0 || rowI + 1 + offset >= lines.length) break;
      if (lines.at(rowI - offset) !== lines.at(rowI + 1 + offset)) {
        matches = false;
      }
      offset++;
    }

    if (matches) {
      return (rowI + 1) * 100;
    }
  }

  return 0;
};

const findColI = (pattern: string, allowSmudge = false) => {
  const lines = pattern.split("\n");
  for (let colI = 0; colI < lines[0].length; colI++) {
    const left = columnToLine(lines, colI);
    const right = columnToLine(lines, colI + 1);
    if (left !== right) continue;
    let matches = true;
    let offset = 1;
    while (true) {
      if (colI - offset < 0 || colI + 1 + offset >= lines[0].length) break;
      if (
        columnToLine(lines, colI - offset) !==
        columnToLine(lines, colI + 1 + offset)
      ) {
        matches = false;
        break;
      }
      offset++;
    }

    if (matches) {
      return colI + 1;
    }
  }

  return 0;
};

const part1 = (input: string) => {
  const patterns = input.split("\n\n");

  let sum = 0;

  for (const pattern of patterns) {
    sum += findRowI(pattern);
    sum += findColI(pattern);
  }

  return sum;
};

const couldMatch = (a: string, b: string): false | string => {
  if (!a || !b) return false;
  if (a === b) return false;
  let diffI = -1;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      if (diffI !== -1) return false;
      diffI = i;
    }
  }
  if (a[diffI] === "#") return a.slice(0, diffI) + "." + a.slice(diffI + 1);
  return a.slice(0, diffI) + "#" + a.slice(diffI + 1);
};

const part2 = (input: string) => {
  const patterns = input.split("\n\n");

  let sum = 0;
  let count = 0;

  for (const pattern of patterns) {
    console.log("🚀 ~ file: index.ts:95 ~ part2 ~ pattern:", pattern);
    count++;
    const lines = pattern.split("\n");
    for (let rowI = 0; rowI < lines.length; rowI++) {
      const above = lines.at(rowI)!;
      const below = lines.at(rowI + 1)!;

      const possible = couldMatch(above, below);
      if (!possible) continue;

      console.log("RowI", rowI, possible);

      const newPattern = lines.with(rowI, possible).join("\n");
      const newSum = findRowI(newPattern);
      if (newSum) {
        sum += newSum;
        break;
      }
    }

    for (let colI = 0; colI < lines[0].length; colI++) {
      const left = columnToLine(lines, colI);
      const right = columnToLine(lines, colI + 1);

      const possible = couldMatch(left, right);
      if (!possible) continue;

      const newPattern = lines
        .map((l) => l.slice(0, colI) + possible + l.slice(colI + 1))
        .join("\n");
      const newSum = findColI(newPattern);
      if (newSum) {
        sum += newSum;
        break;
      }
    }
  }

  return sum;
};

// testSolution("405", part1, testFile);
testSolution("400", part2, testFile);

// console.log("Part 1:", part1(inputFile)); // 26463 (too low)
// console.log("Part 2:", part2(inputFile));
