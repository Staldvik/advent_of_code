# Java template

The purpose of this template is to give a kickstart to folks for taking part in teh Advent of Code.

## Instructions

### Using it
In ``src`` I have ``Year2021_Day01.java`` as an example (nestled in a few folders, this is standard for Maven).  
It has a counterpart in ``input`` which is a txt.  
In ``Main.java`` a new instance of ``Year2021_Day01`` is called.

A bit of magic happens in the background that matches the Java file with the corresponding input file.

In ``Year2021_Day01.java`` you can see there are 3 methods.
* A generator
* part 1
* part 2

#### Generator
The generator is a method that takes in the input (as a String) and its your job to turn it into something useful and store it in ``this.processed``.  
Generally this is an array (or arraylist) of some sort, whether it is an array of characters, numbers, strings or for the really fancy folks an array of classes.  
The type of ``this.processed`` can be found on line 6 inside the ``Base<>`` which in this case is ``ArrayList<Integer>``.

#### Part 1
Part 1 is where you use ``this.processed`` to actually solve the first problem.

#### Part 2
part 2 is normally a twist on Part 1, the same input and ``this.processed`` but different requirements given to ye.



