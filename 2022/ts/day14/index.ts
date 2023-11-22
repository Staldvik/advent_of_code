import * as stdPath from "https://deno.land/std@0.102.0/path/mod.ts";
const mainModulePath = stdPath.dirname(stdPath.fromFileUrl(Deno.mainModule));
Deno.chdir(mainModulePath);

const ex = await Deno.readTextFile(new URL("./ex.txt", import.meta.url));
const input = await Deno.readTextFile(new URL("./input.txt", import.meta.url));

const parseInput = (input: string) => {
  const paths = input.split("\n");
  let map = new Array(1000).fill(".").map(() => {
    return new Array(1000).fill(".");
  });

  let biggestY = 0;
  for (const path of paths) {
    const points = path.split(" -> ").map((p) => p.split(",").map(Number));

    let fromX = points[0][0];
    let fromY = points[0][1];
    for (const [toX, toY] of points) {
      let dx = toX - fromX;
      while (Math.sign(dx) !== 0) {
        map[fromY][fromX] = "#";
        fromX += Math.sign(dx);
        dx = toX - fromX;
      }

      if (fromX === toX) {
        map[fromY][fromX] = "#";
      }

      let dy = toY - fromY;
      while (Math.sign(dy) !== 0) {
        map[fromY][fromX] = "#";
        fromY += Math.sign(dy);
        dy = toY - fromY;
        biggestY = Math.max(biggestY, fromY);
      }

      if (fromY === toY) {
        map[fromY][fromX] = "#";
      }
    }
  }

  map = map.filter((_, i) => i <= biggestY + 2);
  Deno.writeTextFile("./files/map.txt", prettifyMap(map));
  return { map };
};

const prettifyMap = (map: string[][], ignoreLastLine = false) => {
  let smallestX = Infinity;
  let biggestX = 0;
  let smallestY = Infinity;
  let biggestY = 0;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] !== ".") {
        smallestY = Math.min(smallestY, y);
        biggestY = Math.max(biggestY, y);
        if (ignoreLastLine && y === map.length - 1) continue;
        smallestX = Math.min(smallestX, x);
        biggestX = Math.max(biggestX, x);
      }
    }
  }

  const padding = 4;
  const filteredMap = map
    .map((row) =>
      row.filter((_, x) => x >= smallestX - padding && x <= biggestX + padding)
    )
    .filter((_, y) => y >= smallestY - padding)
    .map((row) => row.join(""))
    .join("\n");

  return filteredMap;
};

const task1 = (input: string) => {
  const sandOrigin = [500, 0];
  const { map } = parseInput(input);

  const isOccupied = (x: number, y: number): boolean =>
    ["#", "o"].includes(map[y]?.[x]);

  let isFlowing = true;
  let sandCount = 0;
  const flow = (x: number, y: number): void => {
    if (map[y] === undefined) {
      isFlowing = false;
      return;
    }
    if (!isOccupied(x, y + 1)) {
      flow(x, y + 1);
    } else {
      if (isOccupied(x - 1, y + 1)) {
        if (isOccupied(x + 1, y + 1)) {
          map[y][x] = "o";
          sandCount++;
        } else {
          flow(x + 1, y);
        }
      } else {
        flow(x - 1, y);
      }
    }
  };

  while (isFlowing) {
    flow(sandOrigin[0], sandOrigin[1]);
  }

  Deno.writeTextFile("./files/mapResult.txt", prettifyMap(map));

  return sandCount;
};

const task2 = (input: string) => {
  const sandOrigin = [500, 0];
  const { map } = parseInput(input);

  // create floor
  for (let i = 0; i < map[0].length; i++) {
    map.at(-1)![i] = "#";
  }

  const isOccupied = (x: number, y: number): boolean =>
    ["#", "o"].includes(map[y]?.[x]);

  let isFlowing = true;
  let sandCount = 0;
  const flow = (x: number, y: number): void => {
    if (isOccupied(sandOrigin[0], sandOrigin[1])) {
      isFlowing = false;
      return;
    }
    if (!isOccupied(x, y + 1)) {
      flow(x, y + 1);
    } else {
      if (isOccupied(x - 1, y + 1)) {
        if (isOccupied(x + 1, y + 1)) {
          map[y][x] = "o";
          sandCount++;
        } else {
          flow(x + 1, y);
        }
      } else {
        flow(x - 1, y);
      }
    }
  };

  while (isFlowing) {
    flow(sandOrigin[0], sandOrigin[1]);
  }

  Deno.writeTextFile("./files/mapResult2.txt", prettifyMap(map, true));

  return sandCount;
};

console.log("Task1(ex): ", task1(ex));
console.log("Task1(input): ", task1(input));

console.log("Task2(ex): ", task2(ex));
console.log("Task2(input): ", task2(input));
