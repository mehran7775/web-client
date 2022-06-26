import { reactive } from "#app";
import { defineStore } from "pinia";
import { encode, decode } from "@msgpack/msgpack";
import { ISharedObject } from "@/types";

let connection: WebSocket | null = null;

export const useWebSocket = defineStore("webSocket", () => {
  
  const watchlist = reactive([]);
  function connect() {
    connection = new WebSocket("wss://localhost:7122/instrument/ws");
    connection.binaryType = "arraybuffer";
    connection.onmessage = (msg) => {
      console.log(msg.data);
    };
    connection.onopen = () =>
      send({
        typ: "TSE_WATCHER",
        time: 0,
        packet_time: "",
        obj: [
          { id: "IRO1SNIR0001", name: "تصنا" },
          { id: "IRO3PJMZ0001", name: "جم" },
        ],
      });
  }

  function send(msg: ISharedObject) {
    connection?.send(encode(msg));
  }

  return { connect, send };
});
