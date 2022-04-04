import { defineStore } from "pinia";
import { reactive } from "#app";
import { marked } from "marked"

export const useContent = defineStore("content", () => {
  const cache = reactive<any>({});
  async function getContent(path: string) {
    if (!cache[path])
      cache[path] = marked.parse(await (await fetch("/content/" + path)).text());
    return cache[path];
  }

  return {
    getContent
  };
});
