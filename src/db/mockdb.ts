export interface PingInterface {
  id: number;
  author: string;
  text: string;
  hashtags: string[];
  mentions: string[];
}

class Ping {
  static count = 0;
  static all: PingInterface[] = [];
}

export default Ping;
