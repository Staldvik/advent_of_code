import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

const part1 = (input: string) => {
  const [timeArr, distanceArr] = input
    .split("\n")
    .map((line) => line.split(": ")[1].split(" ").filter(Boolean).map(Number));

  let sum = 1;

  for (let i = 0; i < timeArr.length; i++) {
    const time = timeArr[i];
    const distance = distanceArr[i];
    const winWay = [];
    let holdTime = 1;
    while (holdTime < time) {
      const distanceTraveled = holdTime * (time - holdTime);

      if (distanceTraveled > distance) winWay.push(holdTime);
      holdTime += 1;
    }

    sum *= winWay.length;
  }

  return sum;
};

const part2 = (input: string) => {
  const [time, distance] = input
    .split("\n")
    .map((line) => line.split(": ")[1].split(" ").filter(Boolean).join(""))
    .map(Number);

  let sum = 0;

  let holdTime = 1;
  while (holdTime < time) {
    const distanceTraveled = holdTime * (time - holdTime);

    if (distanceTraveled > distance) sum += 1;
    holdTime += 1;
  }

  return sum;
};

// testSolution("288", part1, testFile);
testSolution("71503", part2, testFile);

// console.log("Part 1:", part1(inputFile));
console.log("Part 2:", part2(inputFile));
