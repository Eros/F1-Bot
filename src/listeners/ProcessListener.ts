import {getDatabase} from "../index";

export class ProcessListener {

    constructor() {
        /**
         * Listen for the bot being shut down.
         */
        process.on('SIGINT', async () => {
            await getDatabase().disconnect();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            await getDatabase().disconnect();
            process.exit(0);
        });
    }
}