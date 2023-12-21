import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

// px{a<2006:qkq,m>2090:A,rfg}
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

testSolution("19114", part1, testFile);
// testSolution("476889", part1, inputFile);

// testSolution("167409079868000", part2, testFile);
// testSolution("?", part2, inputFile);
