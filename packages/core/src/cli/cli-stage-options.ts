import {ContentLoader} from '../content/storage';
import {Deployment} from '../deployment';

export interface CliStageOptions {
    /** name of the stage - will be the command name */
    name: string;
    /** provide a description for the CLI command for this stage */
    description?: string;

    /** Fix the baseurl for the deployment. Leave empty to add baseUrl parameter to the CLI command. */
    baseUrl?: string;

    /** Provide some loaders to load content from. */
    loaders: () => ContentLoader[];

    deployment: () => Deployment;
}
