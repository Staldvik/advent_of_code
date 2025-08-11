import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

/** Each city is an entry with all its connections in the array */
type CityMap = Map<string, { city: string; distance: number }[]>;

const parseInput = (input: string) => {
  const cities: CityMap = new Map();

  for (const line of input.split("\n")) {
    const regex = /([A-Za-z\s]+) to ([A-Za-z\s]+) = (\d+)/;
    const match = line.match(regex);
    if (match) {
      const [, city1, city2, distance] = match;

      cities.has(city1) || cities.set(city1, []);
      cities.has(city2) || cities.set(city2, []);

      cities.get(city1)?.push({
        city: city2,
        distance: parseInt(distance),
      });

      cities.get(city2)?.push({
        city: city1,
        distance: parseInt(distance),
      });
    }
  }
  return cities;
};

const findRoute = (
  current: string,
  visited: Set<string>,
  currentLength: number,
  cities: CityMap,
  useLongWay = false
): number => {
  visited.add(current);
  if (visited.size === cities.size) return currentLength;
  if (visited.size > cities.size)
    throw new Error("Visited a city more than once");

  const edges = cities.get(current)!;
  let best = useLongWay ? 0 : Infinity;

  const unvisited = edges.filter((c) => !visited.has(c.city));
  for (const next of unvisited) {
    const result = findRoute(
      next.city,
      new Set(visited),
      currentLength + next.distance,
      cities,
      useLongWay
    );
    best = useLongWay ? Math.max(best, result) : Math.min(best, result);
  }

  return best;
};

const part1 = (input: string) => {
  const cities = parseInput(input);

  let shortest = Infinity;
  for (const startCity of cities.keys()) {
    const result = findRoute(startCity, new Set(), 0, cities);
    shortest = Math.min(shortest, result);
  }

  return shortest;
};

const part2 = (input: string) => {
  const cities = parseInput(input);

  let longest = 0;
  for (const startCity of cities.keys()) {
    const result = findRoute(startCity, new Set(), 0, cities, true);
    longest = Math.max(longest, result);
  }

  return longest;
};

testSolution("605", part1, testFile);
testSolution("982", part2, testFile);

console.log("Part 1:", part1(inputFile));
console.log("Part 2:", part2(inputFile)); // 459 too low
