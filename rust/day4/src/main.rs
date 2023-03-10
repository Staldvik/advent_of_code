use std::fs;

fn parse_elf_assignment(elf: &str) -> (i32, i32) {
    elf.split_once("-")
        .map(|(s1, s2)| {
            (
                s1.parse::<i32>().expect("Couldn't parse elf1"),
                s2.parse::<i32>().expect("Couldn't parse elf2"),
            )
        })
        .unwrap()
}

fn part_1(input: &String) -> () {
    let result: i32 = input
        .lines()
        .map(|pair| {
            let elves: Vec<&str> = pair.split(",").collect();
            if let (Some(elf_1), Some(elf_2)) = (elves.get(0), elves.get(1)) {
                let (elf_1_from, elf_1_to) = parse_elf_assignment(elf_1);
                let (elf_2_from, elf_2_to) = parse_elf_assignment(elf_2);

                let elf_1_contains = elf_1_from <= elf_2_from && elf_1_to >= elf_2_to;
                let elf_2_contains = elf_2_from <= elf_1_from && elf_2_to >= elf_1_to;

                if elf_1_contains || elf_2_contains {
                    return 1;
                }

                return 0;
            } else {
                panic!("Couldn't parse elves: {:?}", elves);
            }
        })
        .sum();

    println!("Part 1 is: {result}");
}

fn part_2(input: &String) -> () {
    let result: i32 = input
        .lines()
        .map(|pair| {
            let elves: Vec<&str> = pair.split(",").collect();
            if let (Some(elf_1), Some(elf_2)) = (elves.get(0), elves.get(1)) {
                let (elf_1_from, elf_1_to) = parse_elf_assignment(elf_1);
                let (elf_2_from, elf_2_to) = parse_elf_assignment(elf_2);

                if elf_1_from >= elf_2_from && elf_1_from <= elf_2_to
                    || elf_1_to >= elf_2_from && elf_1_to <= elf_2_to
                    || elf_2_from >= elf_1_from && elf_2_from <= elf_1_to
                    || elf_2_to >= elf_1_from && elf_2_to <= elf_1_from
                {
                    return 1;
                }

                return 0;
            } else {
                panic!("Couldn't parse elves: {:?}", elves);
            }
        })
        .sum();

    println!("Part 2 is: {result}");
}

fn main() {
    let input = fs::read_to_string("src/input.txt").unwrap();
    part_1(&input);
    part_2(&input);
}
