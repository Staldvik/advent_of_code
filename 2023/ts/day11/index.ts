import { getInputFile, getTestFile, readFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

type Pos = {
  x: number;
  y: number;
  name: string;
};

const expandAndGetGalaxies = (input: string) => {
  let rows = input.split("\n");

  // expand columns
  for (let colI = 0; colI < rows[0].length; colI++) {
    const isEmptyCol = rows.every((row) => row[colI] === ".");
    if (isEmptyCol) {
      rows = rows.map((row) => row.slice(0, colI) + "." + row.slice(colI));
      colI++;
    }
  }

  // expand rows
  rows = rows.flatMap((row) => {
    const isEmptyRow = !row.includes("#");
    if (isEmptyRow) return [row, row];
    return row;
  });

  const galaxies: Pos[] = [];
  rows.forEach((row, rowI) => {
    for (let colI = 0; colI < row.length; colI++) {
      const char = row[colI];
      if (char === "#")
        galaxies.push({
          x: colI,
          y: rowI,
          name: `Galaxy #${galaxies.length + 1}`,
        });
    }
  });

  return galaxies;
};

const part1 = (input: string) => {
  const galaxies = expandAndGetGalaxies(input);

  let sum = 0;
  for (const galaxy of galaxies) {
    const restOfGalaxies = galaxies.filter((pos) => pos.name !== galaxy.name);
    sum += restOfGalaxies.reduce((acc, curr) => {
      const distance =
        Math.abs(galaxy.y - curr.y) + Math.abs(galaxy.x - curr.x);

      return acc + distance;
    }, 0);
  }

  return sum / 2;
};

const part2 = (input: string) => {};

// testSolution("374", part1, testFile);

console.log("Part 1:", part1(inputFile));
// console.log("Part 2:", part2(inputFile));
