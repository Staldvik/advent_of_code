use std::{collections::HashMap, fs};

fn parse(input: &String) -> HashMap<String, usize> {
    let mut sizes: HashMap<String, usize> = HashMap::new();
    let mut visited_dirs: Vec<&str> = vec![];
    for line in input.lines() {
        let words: Vec<_> = line.split(" ").collect();
        match (words[0], words[1]) {
            ("$", "ls") => {}
            ("$", "cd") => {
                let target = words.get(2);
                match target {
                    Some(&"..") => {
                        visited_dirs.pop();
                    }
                    Some(target) => {
                        visited_dirs.push(target);
                    }
                    _ => panic!(),
                }
            }
            ("dir", _) => {}
            (file_size, _) => {
                let file_size = file_size.parse::<usize>().unwrap();
                let mut paths_to_update = visited_dirs.clone();
                let mut path = paths_to_update.join("/");
                while paths_to_update.pop().is_some() {
                    sizes
                        .entry(path)
                        .and_modify(|x| *x += file_size)
                        .or_insert(file_size);
                    path = paths_to_update.join("/");
                }
            }
        }
    }

    return sizes;
}

fn task1(input: &String) {
    let sizes = parse(input);
    let sum: usize = sizes
        .iter()
        .map(|(_, x)| x)
        .filter(|x| **x <= 100_000)
        .sum();

    println!("Task 1 is {sum}");
}

const TOTAL_SIZE: usize = 70_000_000;
const REQUIRED_SIZE: usize = 30_000_000;

fn task2(input: &String) {
    let sizes = parse(input);
    let current_size = sizes.get("/").unwrap();
    let free_space = TOTAL_SIZE - current_size;
    let clean_size = REQUIRED_SIZE - free_space;

    let mut sizes = sizes.iter().map(|x| x.1).collect::<Vec<_>>();
    sizes.sort();

    for size in sizes {
        if size >= &clean_size {
            println!("Task 2 is {size}");
            return;
        }
    }
}

fn main() {
    // let ex_input = fs::read_to_string("src/ex.txt").unwrap();
    let input = fs::read_to_string("src/input.txt").unwrap();
    // task1(&ex_input);
    task1(&input);
    // task2(&ex_input);
    task2(&input);
}
