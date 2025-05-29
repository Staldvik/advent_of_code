package day01;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

import static utils.UtilsKt.readInput;

public class Day01 {
    static final String WHITE_SPACE = "   ";
    static final String testInput = readInput("test");
    static final String input = readInput("input");

    public static void main(String[] args) {
        System.out.printf("Part 1 test: %d", part1(testInput));
        System.out.printf("Part 1 input: %d", part1(input));
    }

    static int part1(String input) {
        List<Integer> left = new ArrayList<>();
        List<Integer> right = new ArrayList<>();

        input.lines().map(l -> l.split(WHITE_SPACE)).forEach(parts -> {
            left.add(Integer.parseInt(parts[0]));
            right.add(Integer.parseInt(parts[1]));
        });

        left.sort(null);
        right.sort(null);

        return IntStream.range(0, left.size()).map(i -> Math.abs(left.get(i) - right.get(i))).sum();
    }
}
