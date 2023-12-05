with open("./day4/input.txt") as file:
    cards = (line.split(": ") for line in file)
    copies = {}
    total = 0
    for id,card in cards:
        id = int(id.split()[1])
        card_copies = copies.get(id, 1)
        winners = map(int, card.split(" | ")[0].split())
        given = map(int, card.split(" | ")[1].split())
        matches = set(winners) & set(given)
        for i in range(1,len(matches) + 1):
            copies[id + i] = copies.get(id + i, 1) + card_copies

        total += card_copies

print(total)