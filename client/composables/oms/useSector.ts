import { defineStore } from "pinia";
import { Sector } from "@/types";
import { getSector as GetSector } from "@/repositories/oms/sector_manager";
import { useAxios } from "../useAxios";
import { ref } from "@vue/composition-api";

export class SectortState {
  cache: Map<number, Sector> = new Map<number, Sector>();
}

export const useSectors = defineStore("sectors", () => {
  const state = ref(new SectortState());
  const axios = useAxios().createInstance();
  async function getSector(payload: number): Promise<Sector | undefined> {
    if (state.value.cache.has(payload)) return state.value.cache.get(payload);
    else {
      const sector: Sector = (await GetSector(payload, axios)).data;
      state.value.cache.set(sector.id, sector);
      return sector;
    }
  }
  return {
    state,
    getSector,
  };
});