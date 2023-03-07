fn char_to_priority(c: char) -> i32 {
    let ascii_code = c as i32;
    if ascii_code >= 65 && ascii_code <= 90 {
        return ascii_code - 65 + 27;
    }
    return ascii_code - 97 + 1;
}

fn part_1() -> i32 {
    let text_file = std::fs::read_to_string("src/input.txt").unwrap();
    let rucksacks = text_file.lines();
    let sum: i32 = rucksacks
        .map(|rucksack| {
            let (compartment1, compartment2) = rucksack.split_at(rucksack.len() / 2);
            let priority = compartment1
                .chars()
                .find(|c| compartment2.contains(*c))
                .map(char_to_priority)
                .expect("No duplicate found");

            return priority;
        })
        .sum();

    return sum;
}

fn part_2() -> i32 {
    let text_file = std::fs::read_to_string("src/input.txt").unwrap();
    let rucksacks: Vec<&str> = text_file.lines().collect();
    let mut groups = rucksacks.chunks(3);

    let mut sum = 0;
    while let Some(elf_group) = groups.next() {
        let char = elf_group[0]
            .chars()
            .find(|c| elf_group[1].contains(*c) && elf_group[2].contains(*c));
        if let Some(char) = char {
            sum += char_to_priority(char)
        }
    }

    let alt_method: i32 = rucksacks
        .chunks(3)
        .map(|group| {
            let priority = group[0]
                .chars()
                .find(|c| group[1].contains(*c) && group[2].contains(*c))
                .map(char_to_priority)
                .expect("Couldn't find shared char");
            return priority;
        })
        .sum();

    println!("Part 2 alt: {:?}", alt_method);

    return sum;
}

fn main() {
    let part1 = part_1();
    println!("Part 1: {part1}");

    let part2 = part_2();
    println!("Part 2: {part2}");
}
