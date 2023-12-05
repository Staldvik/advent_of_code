fn read_file() -> String {
    std::fs::read_to_string("src/bin/day3/test.txt").unwrap()
}

#[derive(Debug)]
struct ScratchCard {
    id: u32,
    winning_numbers: Vec<u32>,
    scratch_numbers: Vec<u32>,
}

impl From<String> for ScratchCard {
    fn from(line: String) -> Self {
        let id = line.split(":").nth(1).unwrap().parse().unwrap();
        return ScratchCard {
            id,
            winning_numbers: vec![],
            scratch_numbers: vec![],
        };
    }
}

fn task1() -> u32 {
    let file = read_file();
    let lines = file.lines();

    let s: Vec<_> = lines
        .map(|line| ScratchCard::from(line.to_string()))
        .collect();
    println!("{:?}", s);
    42
}

// fn task2() -> u32 {
//     let file = read_file();
// }

fn main() {
    println!("Task1: {:?}", task1());
    // println!("Task2: {:?}", task2());
}
