import MarkdownIt = require('markdown-it');
import {MarkdownItPlugin} from './markdown-it-plugin';
import {MarkdownProcessor} from '../markdown-processor.interface';
import {injectable, multiInject, optional, unmanaged} from 'inversify';
import * as winston from 'winston';
import {PLATFORM_TYPES} from '../../platform-types';

const iterator: any = require('markdown-it-for-inline');

/**
 * Use markdown-it as backend for markdown processing.
 *
 * Supports registration of custom plugins and setting options.
 *
 * @see https://github.com/markdown-it/markdown-it
 */
@injectable()
export class MarkdownItProcessor implements MarkdownProcessor {

    private _markdownIt: any;
    private _options: any = {};

    constructor(@multiInject(PLATFORM_TYPES.MarkdownItHelper) @optional() plugins: MarkdownItPlugin[] = [],
                @unmanaged() options: any = {html: true}) {
        this._options = options;
        this._markdownIt = new MarkdownIt(this._options);
        plugins.forEach((plugin: MarkdownItPlugin) => this.addPlugin(plugin));

    }

    addPlugin(plugin: MarkdownItPlugin): this {
        winston.debug(`Registered markdown-it plugin '${plugin.constructor.name}'`);
        this._markdownIt.use(iterator, plugin.ruleName, plugin.tokenType, plugin.pluginCallback.bind(plugin));
        return this;
    }

    process(markdown: string): string {
        return this._markdownIt.render(markdown);
    }
}







