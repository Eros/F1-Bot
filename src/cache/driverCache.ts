import cache from "./cache";
import {Driver} from "../interface/Driver";
import axios from "axios";

export async function getDriverData(input: string | number): Promise<Driver> {
    const cacheKey = "driver" + input;

    const data = cache.get<Promise<Driver>>(cacheKey)

    if (data) {
        return data;
    }

    const response = await axios.get('https://ergast.com/api/f1/current/drivers.json');
    const drivers = response.data.MRData.DriverTable.Drivers;

    const driver = drivers.find((d: any) => d.permanentNumber?.toLowerCase() === input || d.familyName.toLowerCase() === input);

    const driverStatsResponse = await axios.get(`https://ergast.com/api/f1/drivers/${driver.driverId}/results.json`);
    const driverStatsData = driverStatsResponse.data;
    const results = driverStatsData.MRData.RaceTable.Races;

    const totalRaces = results.length;
    const totalWins = getTotalWins(results);
    const totalPodiums = getTotalPodiums(results);

    const driverData = driverStatsData.map((dd: any) => {
        name: `${dd.givenName} ${dd.familyName}`
        permNumber: `${dd.permanentNumber}`
        totalRaces: totalRaces
        totalPodiums: totalPodiums
        totalWins: totalWins
        nationality: `${dd.nationality}`
        wikiLink: `${dd.url}`
        dateOfBirth: `${dd.dateOfBirth}`
    });

    cache.set(cacheKey, driverData);

    return driverData;
}

function getTotalPodiums(results: any[]): number {
    let totalPodiums = 0;

    for (let result of results) {
        const pos = parseInt(result.Results[0].position);
        if (pos >= 1 && pos <= 3) {
            totalPodiums++;
        }
    }

    return totalPodiums;
}

function getTotalWins(results: any[]): number {
    let totalWins = 0;
    for (let result of results) {
        if (result.Results[0].position === '1') {
            totalWins++;
        }
    }

    return totalWins;
}