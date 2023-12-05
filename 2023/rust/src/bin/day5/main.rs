fn read_file() -> String {
    std::fs::read_to_string("src/bin/day5/test.txt").unwrap()
}

#[derive(Debug)]
struct Mapping {
    source: u32,
    destination: u32,
    range: u32,
}

#[derive(Debug)]
struct Map {
    name: String,
    mappings: Vec<Mapping>,
}

fn task1() -> u32 {
    let file = read_file();
    let mut lines = file.split("\n\n");

    let seeds: Vec<u32> = lines
        .next()
        .unwrap()
        .split(":")
        .nth(1)
        .unwrap()
        .split_ascii_whitespace()
        .filter_map(|c| c.parse().ok())
        .collect();

    let maps: Vec<Map> = lines
        .map(|line| {
            let mut parts = line.split("\n");
            let name = parts.next().unwrap().to_string();
            let mappings: Vec<Mapping> = parts
                .map(|line| {
                    let parts: Vec<u32> = line
                        .split_ascii_whitespace()
                        .filter_map(|c| c.parse().ok())
                        .collect();
                    Mapping {
                        source: parts[0],
                        destination: parts[1],
                        range: parts[2],
                    }
                })
                .collect();

            Map { name, mappings }
        })
        .collect();

    for map in maps.iter() {
        println!("{:?}", map);
    }

    for x in seeds {}

    42
}

// fn task2() -> u32 {
//     let file = read_file();
// }

fn main() {
    println!("Task1: {:?}", task1());
    // println!("Task2: {:?}", task2());
}
