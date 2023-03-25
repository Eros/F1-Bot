import cache from "./cache";
import axios from "axios";
import {Race} from "../interface/Race";

export async function getCurrentSeason(): Promise<Race[]> {

    const cacheKey = "currentSeason";

    // See if we have the data first.
    const data = cache.get<Promise<Race[]>>(cacheKey);
    if (data) {
        return data;
    }

    const currentYear = new Date().getFullYear();
    const response = await axios.get(`https://ergast.com/api/f1/${currentYear}.json`);
    const racesData = response.data.MRData.RaceTable.Races;

    const races = racesData.map((racesData: any) => ({
        raceName: racesData.raceName,
        date: racesData.date,
        circuit: racesData.circuitId,
        location: `${racesData.Circuit.Location.locality}, ${racesData.Circuit.Location.country}`
    }));

    cache.set(cacheKey, races);

    return races;
};