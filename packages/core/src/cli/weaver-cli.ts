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
            const startTime: number = Date.now();
            let weaverTime: number, loadTime: number, renderTime: number, deployTime: number;

            // container.bind(TYPES.ForemanConfig).toConstantValue(stage.foremanConfig(baseUrl));
            const weaver: Weaver = container.get(Weaver);
            weaverTime = Date.now();

            // load content
            for (const loader of stage.loaders()) {
                await weaver.loadFrom(loader);
            }

            // fixme: introduce lifecycle callbacks
            // if (stage.onLoaded) {
            //     await stage.onLoaded(weaver);
            // }

            // fixme: handle assets
            loadTime = Date.now();

            // render
            weaver.render();
            renderTime = Date.now();

            // deploy
            await weaver.deploy(stage.deployment());
            deployTime = Date.now();

            winston.info(Array(80).join('#'));
            winston.info(`# Foreman set up took ${weaverTime - startTime} ms`);
            winston.info(`# Data retrieval took ${loadTime - weaverTime} ms`);
            winston.info(`# Rendering took ${renderTime - loadTime} ms`);
            winston.info(`# Deployment took ${deployTime - renderTime} ms`);
            winston.info(`# ${Array(25).join('-')}`);
            winston.info(`# Complete run took ${deployTime - startTime} ms`);
            winston.info(Array(80).join('#'));
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
