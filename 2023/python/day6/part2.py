
with open("./day6/input.txt") as file:
    time, distance = map(lambda line: int("".join(line.split()[1:])), file.read().split("\n"))

    winning_holds = 0
    for hold_time in range(1, time - 1):
        resulting_distance = hold_time * (time - hold_time)
        if resulting_distance > distance:
            winning_holds += 1

    print(winning_holds)