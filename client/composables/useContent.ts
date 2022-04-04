import { defineStore } from "pinia";
import { reactive } from "#app";

export const useContent = defineStore("content", () => {
  const cache = reactive<any>({});
  async function getContent(path: string) {
    if (!cache[path])
      cache[path] = await (await fetch("/content/" + path)).text();
    return cache[path];
  }

  return {
    getContent
  };
});
