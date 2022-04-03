<template>
  <v-card>
    <v-card-text>
      <v-list>
        <v-virtual-scroll height="200" item-height="75" :items="msgls">
          <template #default="{ item }">
            <v-list-item :key="item.id">
              <v-list-item-content>
                {{ item.text }}
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "#app";
import { ws_address, Subscrib } from "~/repositories/ws_manager";
import { decode, encode } from "@msgpack/msgpack";

class Message {
  id: number;
  text: string;

  constructor(id = 0, text = "") {
    this.id = id;
    this.text = text;
  }
}

export default defineComponent({
  setup() {
    let counter = 0;
    const msgls: Ref<Message[]> = ref([]);
    let connection = new WebSocket(ws_address);

    connection.onmessage = async function (event) {
      msgls.value.unshift(
        new Message(
          counter++,
          //JSON.stringify(decode(await event.data.arrayBuffer()))
        )
      );
    };
    connection.onopen = function (event) {
      msgls.value.unshift(new Message(counter++, "connected"));
      subscrib();
    };

    const subscrib = function () {
      // TODO read from user profile
      let pack = {
        Subscribe: new Subscrib(["test", "notifications"])
      };
      sendMsg(pack);
    };

    const sendMsg = function (messag: object) {
      if (connection.readyState !== connection.OPEN) {
        connection = new WebSocket(ws_address);
      }
      connection.send(encode(messag));
    };

    return {
      msgls,
    };
  },
});
</script>
