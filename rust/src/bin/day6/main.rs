use std::{
    collections::{HashSet, VecDeque},
    fs::read_to_string,
};

fn has_only_unique(deque: &VecDeque<char>) -> bool {
    let mut set = HashSet::new();
    for c in deque {
        if !set.insert(c) {
            return false;
        }
    }
    return true;
}

fn task1(input: &String) {
    let mut window: VecDeque<char> = VecDeque::new();
    for (i, char) in input.char_indices() {
        window.push_back(char);
        if window.len() < 4 {
            continue;
        }
        if window.len() > 4 {
            window.pop_front();
        }

        if has_only_unique(&window) {
            println!("Task 1 result is {}", i + 1);
            return;
        }
    }
}

fn task2(input: &String) {
    let mut window: VecDeque<char> = VecDeque::new();
    for (i, char) in input.char_indices() {
        window.push_back(char);
        if window.len() < 14 {
            continue;
        }
        if window.len() > 14 {
            window.pop_front();
        }

        if has_only_unique(&window) {
            println!("Task 1 result is {}", i + 1);
            return;
        }
    }
}

fn main() {
    let input = read_to_string("src/bin/day6/input.txt").unwrap();
    task1(&input);
    task2(&input);
}
