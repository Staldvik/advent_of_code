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
  if (binary.length < 6) return { readBits: 0 };
  const version = parseInt(binary.slice(0, 3), 2);
  const type = parseInt(binary.slice(3, 6), 2);

  if (type === PacketType.Value) {
    const packet = new DataPacket(version, type);

    // Starting at 6, read groups of 5
    let i = 6;
    let dataString = "";
    let group = binary.slice(i, i + 5);
    dataString = group.slice(1);
    while (group.startsWith("1")) {
      i += 5;
      group = binary.slice(i, i + 5);
      dataString += group.slice(1);
    }
    packet.data = parseInt(dataString, 2);
    return { packet, readBits: i + 5 };
  } else {
    const lengthTypeId = parseInt(binary.at(6)!);
    const parentPacket = new OperatorPacket(version, type, lengthTypeId);

    let totalReadBits = 0;
    if (parentPacket.lengthType === 0) {
      const totalLength = parseInt(binary.slice(7, 7 + 15));
      let i = 7 + 15;
      while (i < totalLength + 7 + 15) {
        const { packet, readBits } = parsePacket(binary.slice(i));
        i += readBits;
        parentPacket.subPackets.push(packet!);
        totalReadBits += i;
      }
    }

    if (parentPacket.lengthType === 1) {
      const subPacketAmount = parseInt(binary.slice(7, 7 + 11));
      let packetAmount = 0;
      let i = 7 + 11;
      while (packetAmount < subPacketAmount) {
        const { packet, readBits } = parsePacket(binary.slice(i));
        i += readBits;
        parentPacket.subPackets.push(packet!);
        packetAmount = parentPacket.subPackets.length;
        totalReadBits += i;
      }
    }

    return { packet: parentPacket, readBits: totalReadBits };
  }
};

const part1 = (input: string) => {
  const binary = parseInt(input, 16).toString(2);
  const packets: Packet[] = [];

  let cursor = 0;
  while (cursor < binary.length) {
    const { packet, readBits } = parsePacket(binary.slice(cursor));
    console.log("Read", readBits, "bits");
    console.log("Got", packet);

    if (readBits === 0) break;

    cursor += readBits;
    packets.push(packet!);
  }

  return sum(
    collectPackets(packets).map((p) => {
      return p.version;
    })
  );
};

const collectPackets = (packets: Packet[]) => {
  const total: Packet[] = [];
  for (const packet of packets) {
    total.push(packet);
    if (packet instanceof OperatorPacket) {
      total.concat(collectPackets(packet.subPackets));
    }
  }
  return total;
};

const part2 = (input: string) => {};

testSolution("16", part1, testFile);
// testSolution("?", part1, inputFile);

// testSolution("?", part2, testFile);
// testSolution("?", part2, inputFile);
