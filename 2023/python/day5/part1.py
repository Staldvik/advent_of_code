input = open("./test.txt").read()

seeds, *mappings = input.split("\n\n")

seeds = list(map(int, seeds.split(":")[1].split()))

for mapping in mappings:
    ranges = []
    for line in mapping.splitlines()[1:]:
        ranges.append(list(map(int, line.split())))
    
    new = []
    for seed in seeds:
        for dest, origin, diff in ranges:
            if seed in range(origin, origin + diff):
                new.append(seed - origin + dest)
                break
        else:
          new.append(seed)
    seeds = new

print(min(seeds))