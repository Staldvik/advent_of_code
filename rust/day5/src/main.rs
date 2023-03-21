use std::{fs::read_to_string, str::FromStr};

#[derive(Debug)]
struct Stack {
    stack: Vec<char>,
}

impl Stack {
    fn new() -> Self {
        Stack { stack: Vec::new() }
    }

    fn top_crate(&self) -> Option<&char> {
        self.stack.last()
    }

    fn place_crates(&mut self, crates: &[char]) {
        self.stack.extend_from_slice(crates)
    }

    fn lift(&mut self, n: usize) -> Vec<char> {
        let split_point = self.stack.len() - n;
        self.stack.split_off(split_point)
    }
}

#[derive(Debug)]
struct StorageDepot {
    stacks: Vec<Stack>,
}

impl StorageDepot {
    fn new() -> Self {
        Self { stacks: Vec::new() }
    }

    fn print(&self) {
        let answer: Vec<&char> = self
            .stacks
            .iter()
            .map(|stack| stack.top_crate().unwrap_or(&' '))
            .collect();

        println!("Answer is {:?}", answer)
    }
}

impl FromStr for StorageDepot {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let mut storage_depot: StorageDepot = StorageDepot::new();
        let stacks = &mut storage_depot.stacks;

        for row in s.lines().rev() {
            for (offset, c) in row.char_indices().step_by(4) {
                if c == '[' {
                    let stack_index = if offset == 0 { 0 } else { offset / 4 };
                    let next_crate = row.chars().nth(offset + 1).unwrap();
                    match stacks.get_mut(stack_index) {
                        Some(stack) => stack.place_crates(&[next_crate]),
                        None => {
                            let mut new_stack = Stack::new();
                            new_stack.place_crates(&[next_crate]);
                            stacks.push(new_stack);
                        }
                    }
                }
            }
        }

        Ok(storage_depot)
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
        let instructions: Vec<_> = s
            .split_whitespace()
            .filter_map(|s| s.parse::<usize>().ok())
            .collect();

        match instructions[0..=2] {
            [amount, from, to] => Ok(Self { amount, from, to }),
            _ => panic!("Malformed instructions?"),
        }
    }
}

fn main() {
    let input = read_to_string("src/input.txt").unwrap();

    let (crates, instructions) = input
        .split_once("\n\n")
        .expect("Malformed input? No double newline found");

    let mut storage_depot = crates
        .parse::<StorageDepot>()
        .expect("Couldn't parse crates into StorageDepot");

    let stacks = &mut storage_depot.stacks;

    for row in instructions.lines() {
        let current_move = row
            .parse::<Move>()
            .expect("Couldn't parse instruction into Move");

        let Move { amount, from, to } = current_move;

        for _ in 0..amount {
            if let Some(crate_to_move) = stacks.get_mut(from - 1).unwrap().lift(1).last() {
                stacks
                    .get_mut(to - 1)
                    .unwrap()
                    .place_crates(&[*crate_to_move]);
            }
        }
    }

    storage_depot.print();
}
