import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

const findCorrespondingMap = (maps: Map[], currentLocation: number) => {
  return maps.find((m) => {
    const [, source, rangeLength] = m;
    if (currentLocation >= source && currentLocation <= source + rangeLength) {
      return m;
    }
  });
};

const findCorrespondingMapReversed = (maps: Map[], currentLocation: number) => {
  return maps.find((m) => {
    const [destination, , rangeLength] = m;
    if (
      currentLocation >= destination &&
      currentLocation <= destination + rangeLength
    ) {
      return m;
    }
  });
};

type Map = [number, number, number];

const doMove = (currentLocation: number, maps: Map[]) => {
  const correspondingMap = findCorrespondingMap(maps, currentLocation);

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

const parseMap = (mapLines: string[]) => {
  return mapLines.map((m) => {
    const [destination, source, rangeLength] = m
      .split(" ")
      .map((c) => Number(c.trim()));

    return [destination, source, rangeLength] as Map;
  });
};

const part1 = (input: string) => {
  const [seeds, ...maps] = input.split("\n\n");
  const [, ...seedsArr] = seeds?.split(" ").map(Number) || [];
  const mapsArr = maps.map((m) => m.split("\n"));

  let min = Infinity;
  for (const seed of seedsArr) {
    let location: number = seed;
    for (const currentMap of mapsArr) {
      location = doMove(location, parseMap(currentMap));
    }
    min = Math.min(location, min);
  }

  return min;
};

const isValidSeed = (checkSeed: number, seeds: number[]) => {
  for (let i = 0; i < seeds.length; i += 2) {
    const start = seeds[i];
    const stop = start + seeds[i + 1];
    if (checkSeed >= start && checkSeed <= stop) return true;
  }
  return false;
};

const part2 = (input: string) => {
  const [seeds, ...maps] = input.split("\n\n");
  const seedsAsNumbers = seeds.split(" ").slice(1).map(Number);
  const mapsArr = maps
    .map((m) => m.split("\n").filter((m, i) => i !== 0))
    .map((m) => parseMap(m))
    .reverse();

  let testNum = 0;
  while (true) {
    const possibleSeed = mapsArr.reduce((location, maps) => {
      const correspondingMap = findCorrespondingMapReversed(maps, location);
      if (correspondingMap) {
        const [destination, source] = correspondingMap;
        return location - destination + source;
      }
      return location;
    }, testNum);

    if (isValidSeed(possibleSeed, seedsAsNumbers)) return testNum;

    testNum++;
  }
};

testSolution("35", part1, testFile);
testSolution("46", part2, testFile);

console.log("Part 1:", part1(inputFile));
console.log("Part 2:", part2(inputFile));
