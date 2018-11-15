import 'reflect-metadata';
import {
    container,
    ContentModule,
    DecoratorModule,
    PlatformModule,
    WeaverCli,
    WebsiteModule,
    WorkflowModule
} from '@baya/core';
import {LoaderFilesystemModule} from '@baya/loader-filesystem';

import {BlogModule} from '../inversify.config';
import {BlogLoaderProvider} from '../content/storage/blog.loader';
import {FileSystemDeployment} from '@baya/deployment-filesystem';
import path = require('path');

container.load(ContentModule, PlatformModule, WebsiteModule, DecoratorModule, BlogModule, WorkflowModule, LoaderFilesystemModule);

const CLI_VERISON: string = '0.0.1';

const cli: WeaverCli = new WeaverCli(CLI_VERISON);
cli.stage({
    baseUrl: 'http://localhost',
    name: 'local',
    description: 'Deploy to the local file system',
    loaders: () => [
        container.get(BlogLoaderProvider).provideLoader()
    ],
    deployment: () => {
        return new FileSystemDeployment({folder: path.resolve('./preview')});
    },
});
cli.run();
