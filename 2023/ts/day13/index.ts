import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

const columnToLine = (lines: string[], colI: number) =>
  lines.map((l) => l[colI]).join("");

const findRowI = (pattern: string) => {
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

const findColI = (pattern: string) => {
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

const swap = (a: string, i: number) => {
  if (a[i] === "#") return a.slice(0, i) + "." + a.slice(i + 1);
  return a.slice(0, i) + "#" + a.slice(i + 1);
};

const getDiffI = (a: string, b: string): number | false => {
  if (!a || !b) return false;

  let diffI = -1;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      if (diffI !== -1) return false;
      diffI = i;
    }
  }

  return diffI;
};

const part2 = (input: string) => {
  const patterns = input.split("\n\n");

  let sum = 0;
  let count = 0;

  for (const pattern of patterns) {
    console.log("🚀 ~ file: index.ts:95 ~ part2 ~ pattern:", pattern);
    count++;
    const lines = pattern.split("\n");
    let lowRowI = 0;
    for (let rowI = 0; rowI < lines.length; rowI++) {
      const above = lines.at(rowI)!;
      const below = lines.at(rowI + 1)!;

      if (above === below) {
        console.log("ABOVE === BELOW", above, below);
        let hasRemovedSmudge = false;
        let matches = true;
        let offset = 1;
        while (true) {
          if (rowI - offset < 0 || rowI + 1 + offset >= lines.length) break;
          const offsetAbove = lines.at(rowI - offset)!;
          const offsetBelow = lines.at(rowI + 1 + offset)!;
          if (offsetAbove !== offsetBelow) {
            if (!hasRemovedSmudge && getDiffI(offsetAbove, offsetBelow)) {
              hasRemovedSmudge = true;
              offset++;
              continue;
            }
            matches = false;
          }
          offset++;
        }

        if (matches) {
          lowRowI = rowI + 1;
        }
      }

      let diffI = getDiffI(above, below);

      if (diffI) {
        console.log("DIFF ROW I");
        const newPattern = lines.with(rowI, swap(above, diffI)).join("\n");
        const newSum = findRowI(newPattern);
        if (newSum) {
          sum += newSum;
          break;
        }
      }
    }

    for (let colI = 0; colI < lines[0].length; colI++) {
      const left = columnToLine(lines, colI);
      const right = columnToLine(lines, colI + 1);

      if (left === right) {
        console.log("LEFT === RIGHT", left, right);
        const newSum = findColI(pattern);
        if (newSum) {
          sum += newSum;
          break;
        }
      }

      let diffI = getDiffI(left, right);

      if (diffI) {
        const newPattern = lines
          .map((l) => swap(l, diffI as number))
          .join("\n");
        const newSum = findColI(newPattern);
        if (newSum) {
          sum += newSum;
          break;
        }
      }
    }
  }

  return sum;
};

// testSolution("405", part1, testFile);
testSolution("400", part2, testFile);

// console.log("Part 1:", part1(inputFile)); // 26463 (too low)
// console.log("Part 2:", part2(inputFile));
