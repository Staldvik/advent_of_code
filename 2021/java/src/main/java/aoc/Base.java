package aoc;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;


abstract public class Base<T> {
    private String className;
    String input;
    T processed;

    void run(boolean verbose){
        long startTime = System.nanoTime();
        this.className = this.getClass().getSimpleName();
        System.out.println(this.className);

        getInput();
        long time_input = System.nanoTime();
        generator();
        long time_generator = System.nanoTime();
        part1();
        long time_part1 = System.nanoTime();
        generator();
        long time_generator2 = System.nanoTime();
        part2();
        long time_part2 = System.nanoTime();

        if(verbose){
            System.out.printf(
                """
                Time durations (µs):
                    Generator:  %7d
                    Part 1:     %7d
                    Part 2:     %7d
                    Total:      %7d
                """,
                    (time_generator - time_input)/1000,
                    (time_part1 - time_generator)/1000,
                    (time_part2 - time_generator2)/1000,
                    (time_part2 - startTime)/1000
            );
        }

        System.out.println();
    }

    /**
     * Standard format to read the input from file
     */
    void getInput() {
        String path = String.format("./input/%s.txt", this.className);

        StringBuilder contentBuilder = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new FileReader(path))) {
            String sCurrentLine;
            while ((sCurrentLine = reader.readLine()) != null) {
                contentBuilder.append(sCurrentLine).append("\n");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        this.input = contentBuilder.toString();
    }

    /**
     * This method is to convert the input into something usable b y part 1 and 2.
     */
    abstract void generator();

    /**
     * You start off the day with a single
     */
    abstract void part1();

    /**
     * Every day has a part 2 that extends the first part.
     */
    abstract void part2();
}
