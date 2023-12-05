input = open("./input.txt").read()

seeds, *mappings = input.split("\n\n")

seeds = list(map(int, seeds.split(":")[1].split()))
seed_pairs = list(map(lambda i: (seeds[i], seeds[i] + seeds[i+1]), range(0, len(seeds), 2)))

for mapping in mappings:
	mapping_ranges = list(map(lambda range_line: list(map(int, range_line.split())), mapping.splitlines()[1:]))

	completed_pairs = []
	while len(seed_pairs) > 0:
		seedStart, seedEnd = seed_pairs.pop()

		# For each seed, find the first mapping range that overlaps with it
		for destination, source, range_length in mapping_ranges:
			# Find overlaps
			overlapStart = max(seedStart, source)
			overlapEnd = min(seedEnd, source + range_length)

			# If there is an overlap, add the new range and queue up the remaining parts of the seed
			if overlapStart < overlapEnd:
				completed_pairs.append((overlapStart - source + destination, overlapEnd - source + destination))
				if seedStart < overlapStart:
					seed_pairs.append((seedStart, overlapStart))
				if seedEnd > overlapEnd:
					seed_pairs.append((overlapEnd, seedEnd))
				break

		# If there is no overlap, add the seed as-is
		else:
			completed_pairs.append((seedStart, seedEnd))

	seed_pairs = completed_pairs

print(min(seed_pairs)[0])