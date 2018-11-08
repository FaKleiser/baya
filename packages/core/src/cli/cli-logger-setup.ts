import winston = require('winston');
import {defaults} from 'lodash';
import {ConsoleTransportOptions} from 'winston/lib/winston/transports';
import {format} from 'winston';

export class CliLoggerSetup {

    private static readonly CONSOLE_DEFAULT_OPTIONS: ConsoleTransportOptions = {
        format: format.combine(
            format.timestamp(),
            format.cli()
        ),
        level: process.env.LOG_LEVEL || 'info',
        silent: false,
        // stderrLevels: [],
    };

    public static setup(options: ConsoleTransportOptions = {}) {
        winston.remove(winston.transports.Console);
        winston.add(new winston.transports.Console(defaults(options, this.CONSOLE_DEFAULT_OPTIONS)));
    }

}
