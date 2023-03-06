fn char_to_priority(c: char) -> i32 {
    let ascii_code = c as i32;
    if ascii_code >= 65 && ascii_code <= 90 {
        return ascii_code - 65 + 27;
    }
    return ascii_code - 97 + 1;
}

fn main() {
    let text_file = std::fs::read_to_string("src/input.txt").unwrap();
    let rucksacks = text_file.lines();
    let sum: i32 = rucksacks
        .map(|rucksack| {
            let (compartment1, compartment2) = rucksack.split_at(rucksack.len() / 2);
            let priority = compartment1
                .chars()
                .find(|c| compartment2.contains(*c))
                .map(char_to_priority)
                .expect("No duplicates found");

            return priority;
        })
        .sum();

    println!("Sum: {sum}")
}
