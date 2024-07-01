package aoc;

import java.util.ArrayList;

// Put the return type of the generator in Base<>
public class Year2021_Day01 extends Base<ArrayList<Integer>> {

    // The generator's role is to turn teh input file into something useable by part 1 and part 2.
    void generator() {
        // this must have the same type as the return type of this method
        this.processed = new ArrayList<>();
        // read it line by line
        for(String line: this.input.split("\n")){
            // for this one we just want an arraylist of numbers
            this.processed.add(Integer.parseInt(line, 10));
        }
    }

    void part1() {
       int lastValue = this.processed.get(0);

       int counter = 0;
       for(int value: this.processed){
           if(value > lastValue){
               counter += 1;
           }
           lastValue = value;
       }

       // print out teh result
       System.out.printf("Part 1: %d %n", counter);
    }

    void part2() {
        int counter = 0;
        for(int i = 3; i < this.processed.size(); i++){
            int first = this.processed.get(i-3) + this.processed.get(i-2) + this.processed.get(i-1);
            int second = this.processed.get(i-2) + this.processed.get(i-1) + this.processed.get(i);


            if(second > first){
                counter += 1;
            }
        }

        // print out teh result
        System.out.printf("Part 2: %d %n", counter);
    }
}
