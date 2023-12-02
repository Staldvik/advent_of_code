fn read_file() -> String {
    std::fs::read_to_string("src/bin/day2/input.txt").unwrap()
}

fn remove_chars(line: &str) -> String {
    let mut line = line.to_string();
    for char in vec![':', ';', ','] {
        line = line.replace(char, "");
    }
    return line;
}

fn task1() -> u32 {
    let file = read_file();

    file.lines()
        .map(remove_chars)
        .filter_map(|line| {
            let mut line_iter = line.split_whitespace();
            let game_id = line_iter.nth(1);
            let game_id = game_id.unwrap().parse::<u32>().unwrap();

            let colors: Vec<_> = line_iter.collect();
            let mut color_iter = colors.iter().zip(colors.iter().skip(1)).step_by(2);

            let impossible = color_iter.any(|(count, color)| {
                let count = count
                    .parse::<u32>()
                    .expect(format!("Could not parse count: {}", count).as_str());

                match *color {
                    "red" => count > 12,
                    "green" => count > 13,
                    "blue" => count > 14,
                    _ => false,
                }
            });

            if impossible {
                return None;
            } else {
                return Some(game_id);
            }
        })
        .sum()
}

fn task2() -> u32 {
    let file = read_file();

    file.lines()
        .map(|line| {
            let line_iter = line.split_whitespace();
            let colors: Vec<_> = line_iter.map(remove_chars).skip(2).collect();

            let mut min_counts = (0, 0, 0);
            colors
                .iter()
                .zip(colors.iter().skip(1))
                .step_by(2)
                .for_each(|(count, color)| {
                    let count = count
                        .parse::<u32>()
                        .expect(format!("Could not parse count: {}", count).as_str());

                    match color.as_str() {
                        "red" if count > min_counts.0 => min_counts.0 = count,
                        "green" if count > min_counts.1 => min_counts.1 = count,
                        "blue" if count > min_counts.2 => min_counts.2 = count,
                        _ => (),
                    }
                });

            return min_counts.0 * min_counts.1 * min_counts.2;
        })
        .sum()
}

fn main() {
    println!("Task1: {:?}", task1());
    println!("Task2: {:?}", task2());
}
