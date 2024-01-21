use std::fs;

type Forest = Vec<Vec<usize>>;

fn parse(input: &String) -> Forest {
    return input
        .lines()
        .map(|x| x.split("").filter_map(|x| x.parse().ok()).collect())
        .collect();
}

fn visible_horizontally(forest: &Forest, (x, y): (usize, usize)) -> bool {
    let height = forest[y][x];
    let mut visible_left = true;
    let mut visible_right = true;
    for left_x in 0..x {
        let tree = forest[y][left_x];
        if height <= tree {
            visible_left = false;
        }
    }
    for right_x in x + 1..forest[y].len() {
        let tree = forest[y][right_x];
        if height <= tree {
            visible_right = false;
        }
    }
    return visible_left || visible_right;
}

fn visible_vertically(forest: &Forest, (x, y): (usize, usize)) -> bool {
    let height = forest[y][x];
    let mut visible_up = true;
    let mut visible_down = true;
    for up_y in 0..y {
        let tree = forest[up_y][x];
        if tree >= height {
            visible_up = false;
        }
    }
    for down_y in y + 1..forest.len() {
        let tree = forest[down_y][x];
        if tree >= height {
            visible_down = false;
        }
    }
    return visible_up || visible_down;
}

fn task1(input: &String) {
    let forest = parse(input);
    let mut count = 0;
    for y in 1..forest.len() - 1 {
        for x in 1..forest[y].len() - 1 {
            let tree = forest[y][x];
            println!("\nPosition: y:{y} x:{x} is height: {tree}");
            if visible_horizontally(&forest, (x, y)) || visible_vertically(&forest, (x, y)) {
                count += 1;
            }
        }
    }
    println!("\nTask1: {count}")
}

fn task2(input: &String) {}

fn main() {
    let ex_input = fs::read_to_string("src/bin/day8/ex.txt").unwrap();
    // let input = fs::read_to_string("src/input.txt").unwrap();
    task1(&ex_input);
    // task1(&input);
    // task2(&ex_input);
    // task2(&input);
}
