import {DevCommand} from "./impl/DevCommand";

const command: DevCommand = {
    name: 'eval',
    description: 'evaluate developer statements',
    async execute(message, args) {
        let script = args.join('');
        message.reply(':alarm_clock: Running...').then((reply) => {
            try {
                let result = eval(args.join(''));
                if (!result) {
                    reply.edit(':x: Error with evaluating your script');
                } else {
                    reply.edit(':white_check_mark: Done!')
                }
            } catch (exception) {
                console.error(exception);
                reply.edit(':x: Error while evaluating your script');
            }
        });
    }
}

export default command;