import { getInputFile, getTestFile, sum, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

class Packet {
  constructor(public version: number, public type: number) {}
}

class DataPacket extends Packet {
  public data = 0;
}

class OperatorPacket extends Packet {
  constructor(version: number, type: number, public lengthType: number) {
    super(version, type);
  }
  public subPackets: Packet[] = [];
}

enum PacketType {
  Value = 4,
}

const parsePacket = (binary: string) => {
  let cursor = 0;
  console.log("\nNow reading", binary);

  const version = parseInt(binary.slice(cursor, (cursor += 3)), 2);
  const type = parseInt(binary.slice(cursor, (cursor += 3)), 2);

  console.log(`Read header:`, { type, version }, `cursor now at`, cursor);

  if (type === PacketType.Value) {
    console.log("DATA PACKET");
    const packet = new DataPacket(version, type);

    let dataString = "";
    let group = binary.slice(cursor, (cursor += 5));
    dataString = group.slice(1);
    while (group.startsWith("1")) {
      group = binary.slice(cursor, (cursor += 5));
      dataString += group.slice(1);
    }
    packet.data = parseInt(dataString, 2);
    return { packet, readBits: cursor };
  } else {
    const lengthTypeId = parseInt(binary.at(cursor++)!);
    console.log("OPERATOR PACKET WITH", lengthTypeId);
    const parentPacket = new OperatorPacket(version, type, lengthTypeId);

    if (parentPacket.lengthType === 0) {
      console.log("Total length found in", binary.slice(cursor, cursor + 15));
      const totalLength = parseInt(binary.slice(cursor, (cursor += 15)), 2);
      console.log("🚀 ~ parsePacket ~ totalLength:", totalLength);
      while (cursor < totalLength + 7 + 15) {
        console.log("READING", cursor, binary.slice(cursor));
        const { packet, readBits } = parsePacket(binary.slice(cursor));
        cursor += readBits;
        if (readBits === 0) break;
        parentPacket.subPackets.push(packet!);
      }
    }

    if (parentPacket.lengthType === 1) {
      const packetAmount = parseInt(binary.slice(cursor, (cursor += 11)), 2);
      if (packetAmount === 0) return { packet: parentPacket, readBits: cursor };
      console.log("Should have", packetAmount, "packet(s)");

      do {
        console.log("READING", cursor, binary.slice(cursor));
        const { packet, readBits } = parsePacket(binary.slice(cursor));
        console.log("🚀 ~ parsePacket ~ readBits:", readBits);
        cursor += readBits;
        if (readBits === 0) break;
        parentPacket.subPackets.push(packet!);
      } while (parentPacket.subPackets.length < packetAmount);
    }

    console.log("🚀 ~ parsePacket ~ totalReadBits:", cursor);
    return { packet: parentPacket, readBits: cursor };
  }
};

// OFC IT WAS MY INPUT THAT WAS WRONG :((
// const parseInput = (input: string) => {
//   let binary = parseInt(input, 16).toString(2);

//   if (["0", "1", "2", "3"].includes(input.at(0)!)) {
//     binary = "00" + binary;
//   }
//   if (["4", "5", "6", "7"].includes(input.at(0)!)) {
//     binary = "0" + binary;
//   }

//   return binary;
// };

const parseInput = (input: string) => {
  console.log("🚀 ~ parseInput ~ input:", input);
  let binary = "";
  for (const hex of input.split("")) {
    const hexInBinary = parseInt(hex, 16).toString(2);
    binary += hexInBinary.padStart(4, "0");
  }
  return binary;
};

const part1 = (input: string) => {
  const binary = parseInput(input);
  console.log("Input: ", binary);
  console.log("Input is", binary.length, "bits long", "\n");

  const { packet, readBits } = parsePacket(binary);
  console.log("🚀 ~ part1 ~ packet:", packet, "by reading", readBits);
  const packets = flattenPackets([packet]);
  console.log("🚀 ~ part1 ~ packets:", packets);

  return sum(packets.map((p) => p.version));
};

const flattenPackets = (packets: Packet[]) => {
  const total: Packet[] = [];
  for (const packet of packets) {
    total.push(packet);
    if (packet instanceof OperatorPacket) {
      total.push(...flattenPackets(packet.subPackets));
    }
  }
  return total;
};

const part2 = (input: string) => {};

testSolution("16", part1, testFile);
testSolution("?", part1, inputFile);

// testSolution("?", part2, testFile);
// testSolution("?", part2, inputFile);
