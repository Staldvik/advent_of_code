use std::{collections::HashMap, fs};

fn task1(input: &String) {
    let mut sizes: HashMap<&str, usize> = HashMap::new();
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
                for dir in visited_dirs.iter() {
                    sizes
                        .entry(dir)
                        .and_modify(|s| *s += file_size)
                        .or_insert(file_size);
                }
            }
        }
    }

    let sum: usize = sizes
        .iter()
        .map(|(_, x)| x)
        .filter(|x| **x <= 100_000)
        .sum();

    println!("Task 1 is {sum}");
}

// fn task2(input: &String) {
//     todo!()
// }

fn main() {
    let ex_input = fs::read_to_string("src/ex.txt").unwrap();
    let input = fs::read_to_string("src/input.txt").unwrap();
    task1(&ex_input);
    task1(&input);
    // task2(&input);
}
