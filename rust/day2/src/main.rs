use core::panic;
use std::{cmp::Ordering, str::FromStr};

#[derive(Debug, PartialEq, Copy, Clone)]
enum Choice {
    Rock = 1,
    Paper = 2,
    Scissors = 3,
}

#[derive(Debug, PartialEq)]
enum Strategy {
    Win,
    Lose,
    Draw,
}

impl PartialOrd for Choice {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        if self == &Choice::Rock && other == &Choice::Scissors {
            Some(Ordering::Greater)
        } else if self == &Choice::Scissors && other == &Choice::Rock {
            Some(Ordering::Less)
        } else {
            Some((*self as u8).cmp(&(*other as u8)))
        }
    }
}

impl FromStr for Choice {
    type Err = String;
    fn from_str(code: &str) -> Result<Self, Self::Err> {
        match code {
            "A" | "X" => Ok(Choice::Rock),
            "B" | "Y" => Ok(Choice::Paper),
            "C" | "Z" => Ok(Choice::Scissors),
            _ => Err(format!("Not a known choice: {code}")),
        }
    }
}

impl FromStr for Strategy {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "X" => Ok(Strategy::Lose),
            "Y" => Ok(Strategy::Draw),
            "Z" => Ok(Strategy::Win),
            _ => Err("Not a known strategy".to_string()),
        }
    }
}

impl Strategy {
    fn get_move(&self, opponent: Choice) -> Choice {
        match self {
            Strategy::Win => match opponent {
                Choice::Rock => Choice::Paper,
                Choice::Paper => Choice::Scissors,
                Choice::Scissors => Choice::Rock,
            },
            Strategy::Lose => match opponent {
                Choice::Rock => Choice::Scissors,
                Choice::Paper => Choice::Rock,
                Choice::Scissors => Choice::Paper,
            },
            Strategy::Draw => opponent.clone(),
        }
    }
}

fn main() {
    let text_file = std::fs::read_to_string("src/input.txt").unwrap();
    let rounds: Vec<&str> = text_file.lines().collect();

    let mut part1: u32 = 0;

    for round in &rounds {
        let mut players = round.split(" ");
        let opponent = players.next().unwrap().parse::<Choice>().unwrap();
        let you = players.next().unwrap().parse::<Choice>().unwrap();

        match you.partial_cmp(&opponent) {
            Some(Ordering::Equal) => part1 += 3 + you as u32,
            Some(Ordering::Greater) => part1 += 6 + you as u32,
            Some(Ordering::Less) => part1 += 0 + you as u32,
            None => panic!("Couldn't compare!"),
        }
    }

    println!("Part 1 is {part1}!");

    let mut part2: u32 = 0;

    for round in &rounds {
        let mut players = round.split(" ");
        let opponent = players.next().unwrap().parse::<Choice>().unwrap();
        let strategy = players.next().unwrap().parse::<Strategy>().unwrap();
        let you = strategy.get_move(opponent);

        match you.partial_cmp(&opponent) {
            Some(Ordering::Equal) => part2 += 3 + you as u32,
            Some(Ordering::Greater) => part2 += 6 + you as u32,
            Some(Ordering::Less) => part2 += 0 + you as u32,
            None => panic!("Couldn't compare!"),
        }
    }

    println!("Part 2 is {part2}!")
}
