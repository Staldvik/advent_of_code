const ex = await Deno.readTextFile(new URL("./ex.txt", import.meta.url));
const input = await Deno.readTextFile(new URL("./input.txt", import.meta.url));

const parseInput = (input: string) => {
  const lines = input.split("\n");
  const sensors = lines.map((line) => {
    const [sx, sy, bx, by] = line.match(/-?\d+/g)!;
    const sensorLocation = [Number(sx), Number(sy)];
    const closestBeacon = [Number(bx), Number(by)];
    const distanceToBeacon = getManhattanDistance(
      sensorLocation,
      closestBeacon
    );
    return {
      sensorLocation,
      closestBeacon,
      distanceToBeacon,
    };
  });

  let minY = Infinity;
  let minX = Infinity;
  let maxY = -Infinity;
  let maxX = -Infinity;
  for (const sensor of sensors) {
    const sensorReach = sensor.distanceToBeacon;
    minX = Math.min(minX, sensor.sensorLocation[0] - sensorReach);
    maxX = Math.max(maxX, sensor.sensorLocation[0] + sensorReach);
    minY = Math.min(minY, sensor.sensorLocation[1] - sensorReach);
    maxY = Math.max(maxY, sensor.sensorLocation[1] + sensorReach);
  }

  return { sensors, minX, minY, maxX, maxY };
};

const getManhattanDistance = (a: number[], b: number[]) => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
};

const task1 = (input: string, y: number) => {
  const { sensors, minX, maxX } = parseInput(input);
  let x = minX;
  let counter = 0;
  while (x < maxX) {
    for (const sensor of sensors) {
      const distanceToSensor = getManhattanDistance(
        [x, y],
        sensor.sensorLocation
      );
      if (distanceToSensor <= sensor.distanceToBeacon) {
        const isBeacon = sensors.some(
          (s) => s.closestBeacon[0] === x && s.closestBeacon[1] === y
        );
        if (!isBeacon) counter++;
        break;
      }
    }
    x++;
  }
  return counter;
};

const task2 = (input: string, max: number) => {
  const { sensors, maxX, maxY } = parseInput(input);
  const cMaxX = Math.min(max, maxX);
  const cMaxY = Math.min(max, maxY);

  const checkIfSeenBySensor = (x: number, y: number) => {
    for (const sensor of sensors) {
      const distanceToSensor = getManhattanDistance(
        [x, y],
        sensor.sensorLocation
      );
      if (distanceToSensor <= sensor.distanceToBeacon) {
        return true;
      }
    }
    return false;
  };

  for (const { sensorLocation, distanceToBeacon } of sensors) {
    let y = Math.max(0, sensorLocation[1] - distanceToBeacon - 1);
    while (y < cMaxY && y < sensorLocation[1] + distanceToBeacon + 1) {
      const xDiff = distanceToBeacon - Math.abs(y - sensorLocation[1]) + 1;
      const x1 = sensorLocation[0] - xDiff;
      const x2 = sensorLocation[0] + xDiff;

      if (x1 > 0 && x1 < cMaxX) {
        const seenBySensor = checkIfSeenBySensor(x1, y);
        if (!seenBySensor) {
          console.log(`Beacon location: x=${x1} y=${y}`);
          return x1 * 4000000 + y;
        }
      }

      if (x2 > 0 && x2 < cMaxX) {
        const seenBySensor = checkIfSeenBySensor(x2, y);
        if (!seenBySensor) {
          console.log(`Beacon location: x=${x2} y=${y}`);
          return x2 * 4000000 + y;
        }
      }

      y++;
    }
  }

  return false;
};

console.log("Task1(ex): ", task1(ex, 10));
console.log("Task1(input): ", task1(input, 2000000));

console.log("Task2(ex): ", task2(ex, 20));
console.log("Task2(input): ", task2(input, 4000000));
