use std::fs::read_to_string;

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

fn main() {
    let input = read_to_string("src/input.txt").unwrap();

    let (crates, instructions) = input
        .split_once("\n\n")
        .expect("Malformed input? No double newline found");

    let mut storage_depot: StorageDepot = StorageDepot::new();
    let stacks = &mut storage_depot.stacks;

    for row in crates.lines().rev() {
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

    for row in instructions.lines() {
        let instructions: Vec<_> = row
            .split_whitespace()
            .filter_map(|s| s.parse::<usize>().ok())
            .collect();

        let (amount, from, to) = match instructions[0..=2] {
            [amount, from, to] => (amount, from, to),
            _ => panic!("Malformed instructions?"),
        };

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
