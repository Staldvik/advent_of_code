use std::{collections::HashMap, fs};

fn task1(input: &String) {
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
