import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

const part1 = (input: string) => {
  const lines = input.split("\n");
  let sum = 0;
  for (let line of lines) {
    line = line.replaceAll(",", "").replaceAll(":", "").replaceAll(";", "");
    const [, gameId, ...colors] = line.split(" ");

    let possible = true;
    for (let index = 0; index < colors.length; index += 2) {
      const count = Number(colors[index]);
      const color = colors[index + 1];

      if (color === "red" && count > 12) possible = false;
      if (color === "green" && count > 13) possible = false;
      if (color === "blue" && count > 14) possible = false;
    }

    if (possible) {
      sum += parseInt(gameId);
    }
  }

  return sum;
};

const part2 = (input: string) => {
  const lines = input.split("\n");
  let sum = 0;
  for (let line of lines) {
    line = line.replaceAll(",", "").replaceAll(":", "").replaceAll(";", "");
    const [, gameId, ...colors] = line.split(" ");

    const maxSeen = {
      red: 0,
      green: 0,
      blue: 0,
    };
    for (let index = 0; index < colors.length; index += 2) {
      const count = Number(colors[index]);
      const color = colors[index + 1];

      if (color === "red" && count > maxSeen.red) maxSeen.red = count;
      if (color === "green" && count > maxSeen.green) maxSeen.green = count;
      if (color === "blue" && count > maxSeen.blue) maxSeen.blue = count;
    }

    sum += maxSeen.red * maxSeen.blue * maxSeen.green;
  }

  return sum;
};

// testSolution("8", part1, testFile);
testSolution("2286", part2, testFile);

// console.log("Part 1:", part1(inputFile));
console.log("Part 2:", part2(inputFile));
