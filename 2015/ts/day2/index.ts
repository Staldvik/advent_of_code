import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

const doMove = (pos: number[], dir: string) => {
  if (dir === "^") pos[1]++;
  if (dir === "v") pos[1]--;
  if (dir === ">") pos[0]++;
  if (dir === "<") pos[0]--;
};

const countVisits = (moves: string[]) => {
  let santa = [0, 0];

  const seen = new Set([santa.toString()]);

  moves.forEach((move) => {
    doMove(santa, move);
    seen.add(santa.toString());
  });

  return seen.size;
};

const part1 = (input: string) => {
  return countVisits(input.split(""));
};

const countVisitsWithRobot = (moves: string[]) => {
  let santa = [0, 0];
  let robot = [0, 0];

  const seen = new Set([santa.toString()]);

  moves.forEach((move, i) => {
    if (i % 2 === 0) {
      doMove(santa, move);
      seen.add(santa.toString());
    } else {
      doMove(robot, move);
      seen.add(robot.toString());
    }
  });

  return seen.size;
};

const part2 = (input: string) => {
  return countVisitsWithRobot(input.split(""));
};

testSolution("2", part1, testFile);
testSolution("11", part2, testFile);

console.log("Part 1:", part1(inputFile));
console.log("Part 2:", part2(inputFile));
