import type { RegionData } from "./types/MapTypes";
import webleyIslandRaw from "../../assets/aeromap-data/webley-island.json";
import clarenceIslandRaw from "../../assets/aeromap-data/clarence-island.json";
import kyokkouRaw from "../../assets/aeromap-data/kyokkou.json";
import alavegaRaw from "../../assets/aeromap-data/alavega.json";
import oconiaRaw from "../../assets/aeromap-data/oconia.json";
import eisenyarskRaw from "../../assets/aeromap-data/eisenyarsk.json";
import avalonRaw from "../../assets/aeromap-data/avalon.json";

export const WebleyIsland: RegionData = webleyIslandRaw;
export const ClarenceIsland: RegionData = clarenceIslandRaw;
export const Kyokkou: RegionData = kyokkouRaw;
export const Alavega: RegionData = alavegaRaw;
export const Oconia: RegionData = oconiaRaw;
export const Eisenyarsk: RegionData = eisenyarskRaw;
export const Avalon: RegionData = avalonRaw;

export const AllRegions: RegionData[] = [WebleyIsland, ClarenceIsland, Kyokkou, Alavega, Oconia, Eisenyarsk, Avalon];