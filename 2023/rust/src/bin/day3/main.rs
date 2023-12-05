fn read_file() -> String {
    std::fs::read_to_string("src/bin/day3/test.txt").unwrap()
}

fn task1() -> u32 {
    let file = read_file();

    let numbers: Vec<_> = file
        .lines()
        .filter_map(|line| {
            let (numbers, _, _) = line.chars().enumerate().fold(
                (vec![], String::new(), false),
                |mut acc, (i, char)| {
                    if char.is_digit(10) || i == line.len() - 1 {
                        return (acc.0, format!("{}{}", acc.1, char), acc.2);
                    } else if !acc.1.is_empty() {
                        println!("acc: {:?}", acc);
                        let number = acc
                            .1
                            .parse::<u32>()
                            .expect(format!("Could not parse {}", acc.1).as_str());
                        acc.0.push(number);
                        return (acc.0, String::new(), acc.2);
                    } else {
                        return acc;
                    }
                },
            );
            return Some(numbers);
        })
        .flatten()
        .collect();

    return numbers.iter().sum();
}

// fn task2() -> u32 {
//     let file = read_file();
// }

fn main() {
    println!("Task1: {:?}", task1());
    // println!("Task2: {:?}", task2());
}
