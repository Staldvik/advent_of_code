fn calculate_every_elf() -> Vec<u32> {
    let text_file = std::fs::read_to_string("src/input.txt").unwrap();
    let lines = text_file.lines();
    let mut elfs: Vec<u32> = Vec::new();

    let mut current_elf = 0;
    for line in lines {
        if line.is_empty() {
            elfs.push(current_elf);
            current_elf = 0;
        } else {
            let cals = line.parse::<u32>().unwrap();
            current_elf += cals;
        }
    }
    elfs.push(current_elf);
    elfs
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
