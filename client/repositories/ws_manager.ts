const ws_address: string = process.env.WS_SERVER || "ws://127.0.0.1:8003";

class Subscrib {
  token: string;
  channels: Array<string>;

  constructor(channels: Array<string>) {
    this.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOltdLCJleHAiOjE2MjM2MTk5MDMsImlhdCI6MTYyMzU4MzkwMywiaXNzIjoiaXNzIiwibmJmIjoxLCJzdWIiOiJzdWJqZWN0IiwiY2hhbiI6W119.h0o_ZUs90CwSEQlSZuOnsGArup2KvQSr1YjzGpktk1xAouOuDmGnOjOHorF3wDwFNJ1jRxW4WZd-_32nQNII6A";
    this.channels = channels;
  }

}

export {
  ws_address,
  Subscrib
};
