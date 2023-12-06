with open("./day6/input.txt") as file:
    times, distances = map(lambda line: list(map(int, line.split()[1:])), file.read().split("\n"))
    
    sum = 1
    for time, distance in zip(times, distances):
        winning_holds = 0
        for hold_time in range(1, time - 1):
            resulting_distance = hold_time * (time - hold_time)
            if resulting_distance > distance:
                winning_holds += 1
        sum *= winning_holds

    print(sum)