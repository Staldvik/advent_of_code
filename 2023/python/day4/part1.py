with open("./day4/input.txt") as file:
    cards = (line.split(": ") for line in file)
    sum = 0
    for _, card in cards:
        winners = map(int, card.split(" | ")[0].split())
        given = map(int, card.split(" | ")[1].split())
        matches = set(winners) & set(given)
        if len(matches) > 0:
            sum += 2 ** (len(matches) - 1)

print(sum)
