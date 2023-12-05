import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

const doMove = (currentLocation: number, [name, ...maps]: string[]) => {
  let correspondingMap: [number, number, number] | undefined = undefined;

  for (let index = 0; index < maps.length; index++) {
    const m = maps[index];
    const [destination, source, rangeLength] = m
      .split(" ")
      .map((c) => Number(c.trim()));

    if (currentLocation >= source && currentLocation <= source + rangeLength) {
      correspondingMap = [destination, source, rangeLength];
      break;
    }
  }

  if (correspondingMap) {
    const [destination, source, rangeLength] = correspondingMap;
    let start = 0;
    let end = rangeLength - 1;

    while (start <= end) {
      let mid = Math.floor((start + end) / 2);

      if (source + mid === currentLocation) return destination + mid;
      else if (source + mid < currentLocation) start = mid + 1;
      else end = mid - 1;
    }
  }

  return currentLocation;
};

const part1 = (input: string) => {
  const seedLocation: Record<string, number> = {};

  const [seeds, ...maps] = input.split("\n\n");
  const [, ...seedsArr] = seeds?.split(" ").map(Number) || [];
  const mapsArr = maps.map((m) => m.split("\n"));

  for (const seed of seedsArr) {
    let location: number = seed;
    for (const currentMap of mapsArr) {
      location = doMove(location, currentMap);
    }
    seedLocation[seed] = Number(location);
  }

  return Math.min(...Object.values(seedLocation));
};

const part2 = (input: string) => {
  let min = Infinity;

  const [seeds, ...maps] = input.split("\n\n");
  const mapsArr = maps.map((m) => m.split("\n"));

  const [, ...seedsArr] = seeds?.split(" ").map(Number) || [];
  for (let i = 0; i < seedsArr.length; i += 2) {
    const start = Number(seedsArr[0]);
    const stop = start + Number(seedsArr[1]);
    for (let seed = start; seed < stop; seed++) {
      let location: number = seed;
      for (const currentMap of mapsArr) {
        location = doMove(location, currentMap);
      }
      min = Math.min(location, min);
    }
  }

  return min;
};

testSolution("35", part1, testFile);
testSolution("46", part2, testFile);

console.log("Part 1:", part1(inputFile)); // Correct: 278755257
// console.log("Part 2:", part2(inputFile));
