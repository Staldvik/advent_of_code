import fs from "fs";

const text = fs.readFileSync(new URL("./input.txt", import.meta.url), "utf8");

const task1 = () => {
  const lines = text.split("\n");

  let totalAmountOfTrees = lines.length * lines[0].length;
  let amountOfHiddenTrees = 0;
  for (let y = 1; y < lines.length - 1; y++) {
    const line = lines[y];
    for (let x = 1; x < line.length - 1; x++) {
      const currentTree = Number(line[x]);

      const [left, right] = [line.substring(0, x), line.substring(x + 1)];
      const horisontallyHidden =
        left.split("").some((tree) => Number(tree) >= currentTree) &&
        right.split("").some((tree) => Number(tree) >= currentTree);

      const [above, below] = [lines.slice(0, y), lines.slice(y + 1)];
      const verticallyHidden =
        above.some((l) => Number(l[x]) >= currentTree) &&
        below.some((l) => Number(l[x]) >= currentTree);

      if (horisontallyHidden && verticallyHidden) {
        amountOfHiddenTrees++;
      }
    }
  }
  return totalAmountOfTrees - amountOfHiddenTrees;
};

const task2 = () => {
  const lines = text.split("\n");

  let scenicScore = 0;

  for (let y = 1; y < lines.length - 1; y++) {
    const line = lines[y];
    for (let x = 1; x < line.length - 1; x++) {
      const currentTree = Number(line[x]);

      const [left, right] = [line.substring(0, x), line.substring(x + 1)];
      const [above, below] = [lines.slice(0, y), lines.slice(y + 1)];

      let closestLeft = x;
      left.split("").forEach((tree, i) => {
        if (Number(tree) >= currentTree)
          closestLeft = Math.min(closestLeft, x - i);
      });

      let closestRight = line.length - x - 1;
      right.split("").forEach((tree, i) => {
        if (Number(tree) >= currentTree)
          closestRight = Math.min(closestRight, i + 1);
      });

      let closestAbove = y;
      above.forEach((l, i) => {
        if (Number(l[x]) >= currentTree)
          closestAbove = Math.min(closestAbove, x - i);
      });

      let closestBelow = lines.length - y - 1;
      below.forEach((l, i) => {
        if (Number(l[x]) >= currentTree)
          closestBelow = Math.min(closestBelow, i + 1);
      });

      const currentScore =
        closestLeft * closestRight * closestAbove * closestBelow;

      scenicScore = Math.max(scenicScore, currentScore);
    }
  }
  return scenicScore;
};

console.log("Task1: ", task1());
console.log("Task2: ", task2());
