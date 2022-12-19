const ex = await Deno.readTextFile(new URL("./ex.txt", import.meta.url));
const input = await Deno.readTextFile(new URL("./input.txt", import.meta.url));

const parseInput = (input: string) => input.split("");

const rock1 = ["@@@@"];
const rock2 = [".@.", "@@@", ".@."];
const rock3 = ["..@", "..@", "@@@"];
const rock4 = ["@", "@", "@", "@"];
const rock5 = ["@@", "@@"];

const rocks = [rock1, rock2, rock3, rock4, rock5];

const task1 = (input: string) => {
  const jets = parseInput(input) as ("<" | ">")[];
  let tower = ["#######"];
  let tick = 0;

  for (let i = 0; i < 2021; i++) {
    tower = tower.filter((row) => row.includes("#"));
    // Insert space for new rock
    tower.unshift(".......");
    tower.unshift(".......");
    tower.unshift(".......");
    const rock = rocks[i % rocks.length];
    tower.unshift(...rock.map((row) => `..${row}`.padEnd(7, ".")));

    let falling = true;
    let y = 0;
    while (falling) {
      let touching: ("left" | "right")[] = [];
      const pushDirection = jets[tick % jets.length];

      for (let j = 0; j < rock.length; j++) {
        const allFallingRows = tower.filter((row) => row.includes("@"));
        if (
          allFallingRows.some((row, index) => {
            if (row.indexOf("@") === 0) return true;
            return row.split("").some((char, i) => {
              if (char === "@" && row[i - 1] === "#") return true;
              return false;
            });
          })
        ) {
          touching.push("left");
        }
        if (
          allFallingRows.some((row, index) => {
            if (row.lastIndexOf("@") === 6) return true;
            return row.split("").some((char, i) => {
              if (char === "@" && row[i + 1] === "#") return true;
              return false;
            });
          })
        ) {
          touching.push("right");
        }
      }

      if (pushDirection === "<" && !touching.includes("left")) {
        tower = tower.map((row) => {
          if (!row.includes("@")) return row;
          const rowArray = row.split("");
          for (let i = 1; i < rowArray.length; i++) {
            if (rowArray[i] === "@") {
              rowArray[i] = ".";
              rowArray[i - 1] = "@";
            }
          }
          return rowArray.join("");
        });
      }
      if (pushDirection === ">" && !touching.includes("right")) {
        tower = tower.map((row) => {
          if (!row.includes("@")) return row;
          const rowArray = row.split("");
          for (let i = rowArray.length - 1; i >= 0; i--) {
            if (rowArray[i] === "@") {
              rowArray[i] = ".";
              rowArray[i + 1] = "@";
            }
          }
          return rowArray.join("");
        });
      }

      for (let rockRow = 0; rockRow < rock.length; rockRow++) {
        const towerIndex = y + rockRow;
        const rockRowString = tower[towerIndex];
        if (!rockRowString) {
          falling = false;
          break;
        }
        for (let i = 0; i < rockRowString.length; i++) {
          if (rockRowString[i] !== "@") continue;
          if (tower[towerIndex + 1][i] === "#") falling = false;
        }
      }

      if (falling) {
        for (let towerRow = tower.length - 1; towerRow > 0; towerRow--) {
          const aboveRow = tower[towerRow - 1].split("");
          const newRow = tower[towerRow].split("");
          if (!aboveRow.includes("@")) continue;

          for (let i = 0; i < newRow.length; i++) {
            if (aboveRow[i] === "@") {
              newRow[i] = "@";
              aboveRow[i] = ".";
            }
          }

          tower[towerRow] = newRow.join("");
          tower[towerRow - 1] = aboveRow.join("");
        }
        y++;
      } else {
        tower.forEach((row, i) => {
          tower[i] = row.replaceAll("@", "#");
        });
      }

      // console.log("Tower after:\n" + tower.join("\n"));
      tick++;
    }
  }

  return tower.length - 1;
};

const task2 = (input: string) => {};

console.log("Task1(ex): ", task1(ex));
console.log("Task1(input): ", task1(input));

// console.log("Task2(ex): ", task2(ex));
// console.log("Task2(input): ", task2(input));
