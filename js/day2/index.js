import fs from "fs";

const points = {
  X: 1, // Rock
  Y: 2, // Paper
  Z: 3, // Scissors
};

const opponentMap = {
  A: "X",
  B: "Y",
  C: "Z",
};

const outcomeMap = {
  X: "loss",
  Y: "draw",
  Z: "win",
};

const getResultPoints = (opponent, player) => {
  if (opponentMap[opponent] === player) return 3;
  if (opponent === "A") return player === "Z" ? 0 : 6;
  if (opponent === "B") return player === "X" ? 0 : 6;
  if (opponent === "C") return player === "Y" ? 0 : 6;
};

const getResponse = (opponent, outcome) => {
  if (outcome === "draw") return opponentMap[opponent];
  if (opponent === "A") return outcome === "win" ? "Y" : "Z";
  if (opponent === "B") return outcome === "win" ? "Z" : "X";
  if (opponent === "C") return outcome === "win" ? "X" : "Y";
};

const text = fs.readFileSync(new URL("./input.txt", import.meta.url), "utf8");

const task1 = () => {
  let sum = 0;
  text.split("\n").forEach((row) => {
    const [opponent, player] = row.split(" ");
    const stratPoints = points[player];
    const resultPoints = getResultPoints(opponent, player);
    sum += stratPoints + resultPoints;
  });
  return sum;
};

const task2 = () => {
  let sum = 0;
  text.split("\n").forEach((row) => {
    const [opponent, outcome] = row.split(" ");
    const player = getResponse(opponent, outcomeMap[outcome]);
    const stratPoints = points[player];
    const resultPoints = getResultPoints(opponent, player);
    sum += stratPoints + resultPoints;
  });
  return sum;
};

console.log("Task 1:", task1());
console.log("Task 2:", task2());
