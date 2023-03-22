use std::{fs::read_to_string, str::FromStr};

type Stack = Vec<char>;
type Moves = Vec<Move>;

enum CrateMover {
    V9000,
    V9001,
}

struct StorageDepot {
    stacks: Vec<Stack>,
    crate_mover: CrateMover,
}

impl StorageDepot {
    fn get_top_row(&self) -> String {
        self.stacks
            .iter()
            .filter_map(|stack| stack.last())
            .collect()
    }

    fn use_crate_mover(&mut self, new_mover: CrateMover) {
        self.crate_mover = new_mover;
    }

    fn move_crates(&mut self, moves: Vec<Move>) {
        for Move { amount, from, to } in moves {
            let stack = self.stacks.get_mut(from - 1).unwrap();
            let crates_to_move = stack.split_off(stack.len() - amount);

            match self.crate_mover {
                CrateMover::V9000 => self.stacks[to - 1].extend(crates_to_move.iter().rev()),
                CrateMover::V9001 => self.stacks[to - 1].extend(crates_to_move.iter()),
            }
        }
    }
}

impl FromStr for StorageDepot {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let mut stacks: Vec<Stack> = Vec::new();

        for line in s.lines().rev() {
            for (offset, c) in line.char_indices().skip(1).step_by(4) {
                if c == ' ' {
                    continue;
                }

                let stack_index = offset / 4;
                match stacks.get_mut(stack_index) {
                    Some(stack) => stack.push(c),
                    None => {
                        let mut new_stack = Stack::new();
                        new_stack.push(c);
                        stacks.push(new_stack);
                    }
                }
            }
        }

        return Ok(StorageDepot {
            stacks,
            crate_mover: CrateMover::V9000,
        });
    }
}

struct Move {
    amount: usize,
    from: usize,
    to: usize,
}

impl FromStr for Move {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let instructions: Vec<usize> = s
            .split_whitespace()
            .filter_map(|s| s.parse::<usize>().ok())
            .collect();

        return match instructions[0..=2] {
            [amount, from, to] => Ok(Move { amount, from, to }),
            _ => Err("Malformed instructions?".to_string()),
        };
    }
}

fn parse_input(input: &String) -> (StorageDepot, Moves) {
    let (crates, instructions) = input
        .split_once("\n\n")
        .expect("Couldn't split input. No double newline found");

    let storage_depot = crates.parse::<StorageDepot>().expect(&format!(
        "Couldn't parse crates into StorageDepot: {crates}"
    ));

    let moves: Moves = instructions
        .lines()
        .map(|line| {
            line.parse::<Move>()
                .expect(&format!("Couldn't parse instruction line into Move {line}"))
        })
        .collect();

    return (storage_depot, moves);
}

fn part_1(input: &String) {
    let (mut storage_depot, moves) = parse_input(input);
    storage_depot.move_crates(moves);
    println!("Part 1 answer is: {:?}", storage_depot.get_top_row());
}

fn part_2(input: &String) {
    let (mut storage_depot, moves) = parse_input(input);
    storage_depot.use_crate_mover(CrateMover::V9001);
    storage_depot.move_crates(moves);
    println!("Part 2 answer is: {:?}", storage_depot.get_top_row());
}

fn main() {
    let input = read_to_string("src/input.txt").unwrap();
    part_1(&input);
    part_2(&input);
}
