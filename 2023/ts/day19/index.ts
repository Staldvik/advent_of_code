import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

type Workflows = Map<string, string[]>;
const parseWorkflows = (workflowLines: string[]): Workflows => {
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

const runWorkflow = (
  rating: Rating,
  workflowName: string,
  workflows: Workflows
): boolean => {
  if (workflowName === "A") return true;
  if (workflowName === "R") return false;

  const workflow = workflows.get(workflowName)!;
  const fallback = workflow.at(-1)!;

  for (const condition of workflow) {
    if (!condition.includes(":")) {
      return runWorkflow(rating, condition, workflows);
    }
    const [comp, dest] = condition.split(":");
    const variable = comp.slice(0, 1);
    const variableValue = rating.get(variable)!.toString();
    const conditionWithValue = comp.replace(variable, variableValue);

    const passed = eval(conditionWithValue);
    if (passed) return runWorkflow(rating, dest, workflows);
  }

  return runWorkflow(rating, fallback, workflows);
};

const part1 = (input: string) => {
  const [workflows, ratings] = input.split("\n\n").map((l) => l.split("\n"));
  const workflowsMap = parseWorkflows(workflows);

  let sum = 0;

  for (const ratingString of ratings) {
    const rating = parseRating(ratingString);
    const accepted = runWorkflow(rating, "in", workflowsMap);
    if (accepted) {
      sum += sumRating(rating);
    }
  }

  return sum;
};

const productOfRanges = (ranges: Range[]) => {
  let product = 1;
  for (const [min, max] of ranges) {
    product *= max - min + 1;
  }
  return product;
};

/** Inclusive on both ends */
type Range = [number, number];

const countRanges = (
  ranges: Record<string, Range>,
  workflowName: string,
  workflows: Workflows
) => {
  if (workflowName === "R") return 0;
  if (workflowName === "A") {
    return productOfRanges(Object.values(ranges));
  }

  const workflow = workflows.get(workflowName)!;
  const fallback = workflow.at(-1)!;

  let sum = 0;

  for (const conditions of workflow.slice(0, -1)) {
    const [condition, target] = conditions.split(":");
    const workflowName = condition[0];
    const cmp = condition[1];
    const [low, high] = ranges[workflowName];
    const cmpNum = parseInt(condition.slice(2));

    let passingRange: Range, failingRange: Range;

    if (cmp == "<") {
      passingRange = [low, Math.min(cmpNum - 1, high)];
      failingRange = [Math.max(cmpNum, low), high];
    } else {
      passingRange = [Math.max(cmpNum + 1, low), high];
      failingRange = [low, Math.min(cmpNum, high)];
    }

    if (passingRange[0] <= passingRange[1]) {
      const copy = { ...ranges };
      copy[workflowName] = passingRange;
      sum += countRanges(copy, target, workflows);
    }
    if (failingRange[0] <= failingRange[1]) {
      ranges = { ...ranges };
      ranges[workflowName] = failingRange;
    } else {
      break;
    }
  }

  sum += countRanges(ranges, fallback, workflows);

  return sum;
};

const part2 = (input: string) => {
  const [workflows] = input.split("\n\n").map((l) => l.split("\n"));
  const workflowsMap = parseWorkflows(workflows);

  const possibleRatings = {
    x: [1, 4000],
    m: [1, 4000],
    a: [1, 4000],
    s: [1, 4000],
  } satisfies Record<string, Range>;

  return countRanges(possibleRatings, "in", workflowsMap);
};

testSolution("19114", part1, testFile);
testSolution("476889", part1, inputFile);

testSolution("167409079868000", part2, testFile);
testSolution("132380153677887", part2, inputFile);
