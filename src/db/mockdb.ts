export interface PingInterface {
  id: number;
  author: string;
  text: string;
  hashtags: string[];
  mentions: string[];
}

export class Ping {
  static count = 0;
  static all: PingInterface[] = [];
}

export interface UserInterface {
  id: number;
  username: string;
  name: string;
  email: string;
}

export class User {
  static count = 0;
  static all: UserInterface[] = [];
}
