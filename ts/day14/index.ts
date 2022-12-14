import * as stdPath from "https://deno.land/std@0.102.0/path/mod.ts";
const mainModulePath = stdPath.dirname(stdPath.fromFileUrl(Deno.mainModule));
Deno.chdir(mainModulePath);

const text = await Deno.readTextFile(new URL("./input.txt", import.meta.url));
const ex = await Deno.readTextFile(new URL("./ex.txt", import.meta.url));

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
      if (fromX < toX) {
        while (fromX < toX) {
          map[fromY][fromX] = "#";
          fromX++;
        }
      } else if (fromX > toX) {
        while (fromX > toX) {
          map[fromY][fromX] = "#";
          fromX--;
        }
      }
      if (fromX === toX) {
        map[fromY][fromX] = "#";
      }

      if (fromY < toY) {
        while (fromY < toY) {
          map[fromY][fromX] = "#";
          fromY++;
          if (fromY > biggestY) {
            biggestY = fromY;
          }
        }
      } else if (fromY > toY) {
        while (fromY > toY) {
          map[fromY][fromX] = "#";
          fromY--;
        }
      }

      if (fromY === toY) {
        map[fromY][fromX] = "#";
      }
    }
  }

  map = map.filter((_, i) => i <= biggestY + 2);
  Deno.writeTextFile(
    "./files/map.txt",
    map.map((row) => row.join("")).join("\n")
  );
  return { map, biggestY };
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
    } else if (isOccupied(x, y + 1)) {
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

  Deno.writeTextFile(
    "./files/mapResult.txt",
    map.map((row) => row.join("")).join("\n")
  );

  return sandCount;
};

const task2 = (input: string) => {
  const sandOrigin = [500, 0];
  const { map, biggestY } = parseInput(input);

  // create floor
  for (let i = 0; i < map[biggestY].length; i++) {
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
    } else if (isOccupied(x, y + 1)) {
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

  console.log(Deno.mainModule);

  Deno.writeTextFile(
    "./files/mapResult2.txt",
    map.map((row) => row.join("")).join("\n")
  );

  return sandCount;
};

console.log("Ex: ", task1(ex));
console.log("Task1: ", task1(text));

console.log("Ex: ", task2(ex));
console.log("Task2: ", task2(text));
