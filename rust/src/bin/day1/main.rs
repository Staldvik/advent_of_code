fn calculate_every_elf() -> Vec<u32> {
    let text_file = std::fs::read_to_string("src/bin/day1/input.txt").unwrap();
    text_file
        .split("\n\n")
        .map(|elf| elf.split("\n").map(|num| num.parse::<u32>().unwrap()).sum())
        .collect()
}

fn task1() -> u32 {
    let elfs = calculate_every_elf();
    match elfs.iter().max() {
        Some(&x) => x,
        None => 0,
    }
}

fn task2() -> u32 {
    let mut elfs = calculate_every_elf();
    elfs.sort();
    elfs.iter().rev().take(3).sum()
}

fn main() {
    println!("Task1: {:?}", task1());
    println!("Task2: {:?}", task2());
}
