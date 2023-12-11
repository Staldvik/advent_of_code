import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

type Pos = {
  x: number;
  y: number;
  name: string;
};

const expandAndGetGalaxies = (input: string, boundarySize = 1) => {
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

        const yPenalty = hCrossed.length * Math.max(1, boundarySize - 1);
        const xPenalty = vCrossed.length * Math.max(1, boundarySize - 1);

        galaxies.push({
          x: galaxyX + xPenalty,
          y: galaxyY + yPenalty,
          name: `Galaxy #${galaxies.length + 1}`,
        });
      }
    }
  });

  return galaxies;
};

const sumGalaxyDistances = (galaxies: Pos[]) =>
  galaxies.reduce((total, galaxy, i, arr) => {
    // Check against galaxies to the right to avoid duplicating pairs
    const largerGalaxies = arr.slice(i);
    const galaxySum = largerGalaxies.reduce((galaxySum, largerGalaxy) => {
      const distance =
        Math.abs(galaxy.y - largerGalaxy.y) +
        Math.abs(galaxy.x - largerGalaxy.x);
      return galaxySum + distance;
    }, 0);
    return total + galaxySum;
  }, 0);

const solve = (expandSize: number) => (input: string) => {
  const galaxies = expandAndGetGalaxies(input, expandSize);
  return sumGalaxyDistances(galaxies);
};

testSolution("374", solve(1), testFile);
testSolution("1030", solve(10), testFile);
testSolution("8410", solve(100), testFile);

console.log("Part 1:", solve(1)(inputFile));
console.log("Part 2:", solve(1_000_000)(inputFile));
