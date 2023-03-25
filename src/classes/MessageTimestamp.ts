export enum Format {
    SHORT_DATE = 'd', /** @example 12/12/1997 **/
    SHORT_FULL = 'f', /** @example 12 December 1997 01:45 **/
    SHORT_TIME = 't', /** @example 01:45 **/
    LONG_DATE = 'D', /** @example 12 December 1997 **/
    LONG_FULL = 'F', /** @example Friday, 12 December 1997 01:45 **/
    RELATIVE = 'R', /** @example 2 seconds ago **/
    LONG_TIME = 'T' /** @example 01:45:00 **/
}

export class MessageTimestamp {
    private readonly _date: Date;

    constructor(date: Date) {
        this._date = date;
    }

    get date(): Date {
        return this._date;
    }

    toString<F extends Format>(tsFormat?: F): `<t:${string}:${F | Format.LONG_FULL}>` {
        return this.fromTimestamp(Math.floor(this.date.getTime() / 1000), tsFormat);
    }

    private fromTimestamp<F extends Format>(unixTimestamp: string | number, tsFormat?: F): `<t:${string}:${F | Format.LONG_FULL}>` {
        return `<t:${unixTimestamp}:${tsFormat || Format.LONG_FULL}>`;
    }
}