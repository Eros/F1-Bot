import {Standings} from "../interface/Standings";
import cache from "./cache";
import axios from "axios";

export async function getLeaderboard(): Promise<Standings[]> {
    const cacheKey: string = 'leaderboards';

    const data = cache.get<Promise<Standings[]>>(cacheKey);
    if (data) {
        return data;
    }

    const response = await axios.get('https://ergast.com/api/f1/current/driverStandings.json');
    const standingsData = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

    const standings: Standings[] = standingsData.map((standing: any, index: number) => {
        name: `${standing.name}`;
        points: standing.points;
        position: index + 1;
    });

    cache.set(cacheKey, standings);

    return standings;
}