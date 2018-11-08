import {CommanderStatic} from 'commander';
import {container} from '../inversify.container';
import * as winston from 'winston';
import {CliLoggerSetup} from './cli-logger-setup';
import {CliStageOptions} from './cli-stage-options';
import {Weaver} from '../workflow';


/**
 * Lets create a CLI for your website.
 */
export class WeaverCli {

    public readonly app: CommanderStatic = require('commander');

    constructor(version: string) {
        this.app.version(version)
            .option('-v, --verbose', 'Verbose logging output (log level: debug)')
            .option('-vv, --very-verbose', 'Very verbose logging output (log level: silly)');
    }

    /**
     * Add a stage to the assemblyline.
     */
    public stage(stage: CliStageOptions): this {
        this.app
            .command(`${stage.name}`)
            .option('-b, --baseUrl <baseUrl>', 'The baseUrl to use. Defaults to: http://localhost/')
            .description(stage.description)
            .action(this.errorAwareAction(async (options: any) => {
                const baseUrl: string = options.baseUrl || stage.baseUrl || 'http://localhost/';
                await this.pipeline(baseUrl, stage);
            }));

        return this;
    }


    protected async pipeline(baseUrl: string, stage: CliStageOptions) {
        try {
            // container.bind(TYPES.ForemanConfig).toConstantValue(stage.foremanConfig(baseUrl));
            await container.get(Weaver)
                .withLoaders(stage.loaders())
                .withDeployment(stage.deployment())
                .run();
            winston.info("Finished baya. Have a look at your shiny website!");
        } catch (e) {
            winston.error(`Critical error occucured. Exiting application. Error was:\n ${e.stack}`);
            process.exitCode = 1;
        }
    }

    protected errorAwareAction(command: (...args: any[]) => Promise<void>): () => Promise<void> {
        return async (...args: any[]) => {
            try {
                await command(...args);
            } catch (e) {
                winston.error('Assemblyline encountered an error:');
                if (e.stack) {
                    winston.error(e.stack);
                } else {
                    winston.error(e);
                }
                process.exitCode = 1;
            }
        };
    }

    /**
     * Yeehaw, let's run the assemblyline!
     */
    public run() {
        // configure verbosity
        this.app.parseOptions(process.argv);
        if (this.app.verbose) {
            CliLoggerSetup.setup({level: 'debug'});
        } else if (this.app.veryVerbose) {
            CliLoggerSetup.setup({level: 'silly'});
        } else {
            CliLoggerSetup.setup();
        }
        winston.info('====   assemblyline   ====');

        // execute command
        if (!process.argv.slice(2).length) {
            this.app.outputHelp();
        } else {
            this.app.parse(process.argv);
        }
    }
}
