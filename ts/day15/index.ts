const ex = await Deno.readTextFile(new URL("./ex.txt", import.meta.url));
const input = await Deno.readTextFile(new URL("./input.txt", import.meta.url));

const parseInput = (input: string) => {
  const lines = input.split("\n");
  const sensors = lines.map((line) => {
    const [sensorLocation, closestBeacon] = line.split(":").map((s) =>
      s.split("=").flatMap((s) =>
        s
          .split(",")
          .map((s) => Number(s))
          .filter((s) => !isNaN(s))
      )
    );
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

  const minY = Math.min(
    ...sensors.map((s) => Math.min(s.sensorLocation[1], s.closestBeacon[1]))
  );
  const minX = Math.min(
    ...sensors.map((s) => {
      const minXSensorReach =
        s.sensorLocation[1] -
        getManhattanDistance(s.sensorLocation, s.closestBeacon);
      return Math.min(minXSensorReach, s.closestBeacon[0]);
    })
  );
  const maxY = Math.max(
    ...sensors.map((s) => {
      const maxXSensorReach =
        s.sensorLocation[1] +
        getManhattanDistance(s.sensorLocation, s.closestBeacon);
      return Math.max(maxXSensorReach, s.closestBeacon[1]);
    })
  );
  const maxX = Math.max(
    ...sensors.map((s) => {
      const maxXSensorReach =
        s.sensorLocation[1] +
        getManhattanDistance(s.sensorLocation, s.closestBeacon);
      return Math.max(maxXSensorReach, s.closestBeacon[1]);
    })
  );

  return { sensors, minX, minY, maxX, maxY };
};

const getManhattanDistance = (a: number[], b: number[]) => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
};

const task1 = (input: string, y: number) => {
  const { sensors, minX, maxX } = parseInput(input);
  let pointer = minX;
  let counter = 0;
  while (pointer < maxX) {
    for (const sensor of sensors) {
      const distanceToSensor = getManhattanDistance(
        [pointer, y],
        sensor.sensorLocation
      );
      const sensorsDistanceToBeacon = getManhattanDistance(
        sensor.sensorLocation,
        sensor.closestBeacon
      );
      if (distanceToSensor <= sensorsDistanceToBeacon) {
        if (
          sensors.some(
            (s) => s.closestBeacon[0] === pointer && s.closestBeacon[1] === y
          )
        ) {
          break;
        } else {
          counter++;
          break;
        }
      }
    }

    pointer++;
  }
  return counter;
};

const task2 = (input: string, max: number) => {
  const { sensors, maxX, maxY } = parseInput(input);
  const cMaxX = Math.min(max, maxX);
  const cMaxY = Math.min(max, maxY);

  const checkIfSeenBySensor = (x: number, y: number) => {
    let seenBySensor = false;
    for (const sensor of sensors) {
      const distanceToSensor = getManhattanDistance(
        [x, y],
        sensor.sensorLocation
      );
      const sensorsDistanceToBeacon = getManhattanDistance(
        sensor.sensorLocation,
        sensor.closestBeacon
      );
      if (distanceToSensor <= sensorsDistanceToBeacon) {
        seenBySensor = true;
      }
    }
    return seenBySensor;
  };

  for (const sensor of sensors) {
    let y = Math.max(0, sensor.sensorLocation[1] - sensor.distanceToBeacon - 1);
    while (y < sensor.sensorLocation[1] + sensor.distanceToBeacon + 1) {
      if (y > cMaxY) {
        break;
      }
      const xDiff =
        sensor.distanceToBeacon - Math.abs(y - sensor.sensorLocation[1]) + 1;
      const x1 = sensor.sensorLocation[0] - xDiff;
      const x2 = sensor.sensorLocation[0] + xDiff;

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
