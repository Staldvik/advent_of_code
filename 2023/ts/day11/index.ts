import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

type Pos = {
  x: number;
  y: number;
  name: string;
  hCrossed: number[];
  vCrossed: number[];
};

const expandAndGetGalaxies = (input: string, boundaryCost = 1) => {
  let rows = input.split("\n");
  const vBoundaries: number[] = [];
  const hBoundaries: number[] = [];

  // expand columns
  for (let colI = 0; colI < rows[0].length; colI++) {
    const isEmptyCol = rows.every((row) => row[colI] !== "#");
    if (isEmptyCol) {
      vBoundaries.push(colI);
    }
  }

  // expand rows
  for (let rowI = 0; rowI < rows.length; rowI++) {
    const row = rows[rowI];
    const isEmptyRow = !row.includes("#");
    if (isEmptyRow) {
      hBoundaries.push(rowI);
    }
  }

  const galaxies: Pos[] = [];

  rows.forEach((row, rowI) => {
    for (let colI = 0; colI < row.length; colI++) {
      const char = row[colI];
      if (char === "#") {
        const galaxyX = colI;
        const galaxyY = rowI;

        const hCrossed = hBoundaries.filter((yBoundary) => galaxyY > yBoundary);
        const vCrossed = vBoundaries.filter((xBoundary) => galaxyX > xBoundary);

        galaxies.push({
          x: galaxyX + vCrossed.length * boundaryCost,
          y: galaxyY + hCrossed.length * boundaryCost,
          name: `Galaxy #${galaxies.length + 1}`,
          hCrossed,
          vCrossed,
        });
      }
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

const part2 = (input: string) => {
  const galaxies = expandAndGetGalaxies(input, 999_999);

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

// testSolution("374", part1, testFile);
// testSolution("1030", part2, testFile);

// console.log("Part 1:", part1(inputFile));
console.log("Part 2:", part2(inputFile)); // 504715573144 (too high)
