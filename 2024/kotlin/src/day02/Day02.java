package day02;

import static utils.UtilsKt.readInput;


public class Day02 {
    public static void main(String[] args) {
        var test = readInput("test");
        var input = readInput("input");
        var solver = new Solver();

        System.out.printf("Part 1 test: %d", solver.part1(test));
        System.out.printf("\nPart 1 input: %d", solver.part1(input));
    }
}

class Solver {
    Integer part1(String input) {
        return 1;
    }
}