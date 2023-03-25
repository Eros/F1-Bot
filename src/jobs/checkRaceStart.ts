import axios from "axios";
import {CronJob} from "cron";
import {botEventEmitter} from "../events/BotEventEmitter";

const getCurrentSeason = async () => {
    const response = await axios.get('https://ergast.com/api/f1/current.json');
    const season = response.data.MRData.RaceTable.season;
    return parseInt(season, 10);
};

const getNearestRaceTime = async (season: number) => {
    const response = await axios.get(`https://ergast.com/api/f1/${season}.json`);
    const races = response.data.MRData.RaceTable.Races;
    const currentTime = new Date();

    for (let race of races) {
        const time = new Date(race.date + 'T' + race.time);

        if (time > currentTime) {
            return time;
        }
    }

    return null;
};

const checkRaceStart = async () => {
    try {
        const nearestRaceTime = await getNearestRaceTime(await getCurrentSeason());
        if (!nearestRaceTime) {
            console.log('Could not find any upcoming races');
            return;
        }

        const currentTime = new Date();
        const timeDifferenceInSeconds = (nearestRaceTime.getTime() - currentTime.getTime()) / 1000;

        if (timeDifferenceInSeconds <= 60) {
            botEventEmitter.emit('raceStart');
        }
    } catch (err) {
        throw err;
    }
};

new CronJob('*/1 * * * *', async () => checkRaceStart()).start();