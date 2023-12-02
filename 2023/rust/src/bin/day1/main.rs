fn read_file() -> String {
    std::fs::read_to_string("src/bin/day1/input.txt").unwrap()
}

fn parse_line(line: &str) -> u32 {
    let first = line
        .chars()
        .find(|char| char.is_digit(10))
        .expect("Couldn't find digit in line");
    let second = line.chars().rev().find(|char| char.is_digit(10)).unwrap();
    return format!("{first}{second}")
        .parse()
        .expect(&format!("Couldn't parse {first}{second} as u32"));
}

fn task1() -> u32 {
    read_file().lines().map(parse_line).sum()
}

fn task2() -> u32 {
    let replacements = vec![
        ("one", "o1e"),
        ("two", "t2o"),
        ("three", "t3e"),
        ("four", "f4r"),
        ("five", "f5e"),
        ("six", "s6x"),
        ("seven", "s7n"),
        ("eight", "e8t"),
        ("nine", "n9n"),
        ("zero", "z0o"),
    ];
    read_file()
        .lines()
        .map(|line| {
            let mut line = line.to_string();
            for (from, to) in &replacements {
                line = line.replace(from, to);
            }
            return parse_line(&line);
        })
        .sum()
}

fn main() {
    println!("Task1: {:?}", task1());
    println!("Task2: {:?}", task2());
}
