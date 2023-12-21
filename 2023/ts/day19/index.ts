import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

// px{a<2006:qkq,m>2090:A,rfg}
const parseWorkflows = (workflowLines: string[]) => {
  const workflows = new Map<string, string[]>();
  for (const line of workflowLines) {
    const name = line.split("{")[0];
    const conditions = line.split("{")[1].replace("}", "").split(",");
    workflows.set(name, conditions);
  }
  return workflows;
};

type Rating = Map<string, number>;
const parseRating = (ratingLine: string): Rating => {
  const stripped = ratingLine.replace("{", "").replace("}", "");
  const ratings = new Map<string, number>();
  for (const rating of stripped.split(",")) {
    const [name, value] = rating.split("=");
    ratings.set(name, parseInt(value));
  }
  return ratings;
};

const sumRating = (rating: Rating) => {
  let sum = 0;
  rating.forEach((value) => {
    sum += value;
  });
  return sum;
};

const part1 = (input: string) => {
  const [workflows, ratings] = input.split("\n\n").map((l) => l.split("\n"));
  const workflowsMap = parseWorkflows(workflows);
  const ratingPositions = new Map<Rating, string>();
  let sum = 0;
  for (const line of ratings) {
    const rating = parseRating(line);
    ratingPositions.set(rating, "in");
    let valid = true;
    let i = 0;
    while (true) {
      const currentPos = ratingPositions.get(rating)!;
      if (currentPos === "A") {
        valid = true;
        break;
      }
      if (currentPos === "R") {
        valid = false;
        break;
      }
      const condition = workflowsMap.get(currentPos)![i];
      if (condition === "A") {
        valid = true;
        break;
      }
      if (condition === "R") {
        valid = false;
        break;
      }
      if (!condition.includes(":")) {
        ratingPositions.set(rating, condition);
        i = 0;
        continue;
      }
      const [test, destination] = condition.split(":");
      if (test.includes(">")) {
        const [key, value] = test.split(">");
        if (rating.get(key)! > parseInt(value)) {
          ratingPositions.set(rating, destination);
          i = 0;
        } else {
          i++;
        }
      }
      if (test.includes("<")) {
        const [key, value] = test.split("<");
        if (rating.get(key)! < parseInt(value)) {
          ratingPositions.set(rating, destination);
          i = 0;
        } else {
          i++;
        }
      }
    }
    if (valid) {
      sum += sumRating(rating);
    }
  }

  return sum;
};

const part2 = (input: string) => {
  const [workflows, ratings] = input.split("\n\n").map((l) => l.split("\n"));
  const workflowsMap = parseWorkflows(workflows);

  // For all conditions that can give `A` we need to
  // - find all ratings that can give that condition
  // - find all conditions that can give that workflow

  const aPositions = new Set<string>();
  for (const [workflow, conditions] of workflowsMap) {
    if (conditions.includes("A")) {
      aPositions.add(workflow);
    }
  }
  console.log("🚀 ~ file: index.ts:107 ~ part2 ~ aPositions:", aPositions);

  return 0;
};

// testSolution("19114", part1, testFile);
testSolution("167409079868000", part2, testFile);

// console.log("Part 1:", part1(inputFile));
// console.log("Part 2:", part2(inputFile));
