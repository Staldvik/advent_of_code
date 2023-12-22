import {
  findLCM,
  getInputFile,
  getTestFile,
  readFile,
  testSolution,
} from "../utils";

const testFile = getTestFile(__dirname);
const testFile2 = readFile(__dirname)("./test2.txt");
const inputFile = getInputFile(__dirname);

const parseMap = (map: string) => {
  const mapMap = new Map<string, [string, string]>();

  for (const line of map.split("\n")) {
    const [location, locationInstructions] = line.split(" = ");
    const leftRight = locationInstructions
      .split(", ")
      .map((i) => i.replace("(", "").replace(")", "")) as [string, string];
    mapMap.set(location, leftRight);
  }

  return mapMap;
};

const part1 = (input: string) => {
  const [instructions, map] = input.split("\n\n");
  const mapMap = parseMap(map);

  let steps = 0;
  let location = "AAA";
  while (steps < 1_000_000_000) {
    if (location === "ZZZ") return steps;
    const [ifLeft, ifRight] = mapMap.get(location)!;
    location =
      instructions[steps % instructions.length] === "L" ? ifLeft : ifRight;
    steps += 1;
  }
};

const part2 = (input: string) => {
  const [instructions, map] = input.split("\n\n");
  const mapMap = parseMap(map);

  let steps = 0;
  let locations = [...mapMap.keys()].filter((loc) => loc.endsWith("A"));

  let stepInterval = Array(locations.length).fill(0);

  while (stepInterval.includes(0)) {
    locations.forEach((loc, i) => {
      if (loc.endsWith("Z") && stepInterval[i] === 0) stepInterval[i] = steps;
    });
    const instruction = instructions[steps % instructions.length];
    locations = locations.map((loc) => {
      const [ifLeft, ifRight] = mapMap.get(loc)!;
      return instruction === "L" ? ifLeft : ifRight;
    });
    steps += 1;
  }

  return findLCM(stepInterval);
};

testSolution("6", part1, testFile);
testSolution("6", part2, testFile2);

console.log("Part 1:", part1(inputFile));
console.log("Part 2:", part2(inputFile));
