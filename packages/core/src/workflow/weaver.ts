import {inject, injectable, multiInject} from 'inversify';
import {Website} from '../website/model';
import {SequentialProcessor, TransformationProcessor} from '../content/transformation/processor';
import {RenderedWebsite} from '../website/renderer/website/rendered-website.model';
import {TYPES} from '../types';
import {EntryStore} from '../content/entry';
import {TransformationQueue, Transformer} from '../content/transformation';
import {RendererDispatcher} from '../website/renderer/renderer-dispatcher.service';
import {Page} from '../website/model/page';
import {PathToUrlService} from '../website/url';
import {ContentLoader} from '../content/storage';
import {WebsiteRenderer} from '../website/renderer/website/website-renderer.service';
import {Deployment} from '../deployment';
import {MarkdownProcessor} from '../platform/markdown';
import {PLATFORM_TYPES} from '../platform/platform-types';
import {CombinedLoader} from '../content/storage/combined.loader';
import * as winston from 'winston';

/**
 * The weaver takes care of the static site generation workflow.
 */
@injectable()
export class Weaver {

    private _website: Website;
    private _transformationProcessor: TransformationProcessor;
    private _renderedWebsite: RenderedWebsite;
    private _deployment: Deployment;

    // private _pageDispatcher: RendererDispatcher<Page> = undefined;

    constructor(@inject(EntryStore) private _entriesStore: EntryStore,
                @inject(TransformationQueue) private _toBeTransformed: TransformationQueue,
                @multiInject(TYPES.Transformer) private transformers: Transformer<any>[],
                @inject(TYPES.PageRendererDispatcher) private _pageDispatcher: RendererDispatcher<Page>,
                @inject(PLATFORM_TYPES.MarkdownProcessor) private markdownProcessor: MarkdownProcessor,
                @inject(PathToUrlService) private pathToUrlService: PathToUrlService,
                @inject(CombinedLoader) private combinedLoader: CombinedLoader) {
        this._website = new Website(pathToUrlService);
        this.withDefaultTransformationProcessor();
    }

    // == baya customizations

    public withDeployment(deployment: Deployment): this {
        this._deployment = deployment;
        return this;
    }

    public withLoader(contentLoader: ContentLoader): this {
        this.combinedLoader.registerLoader(contentLoader);
        return this;
    }

    public withLoaders(contentLoaders: ContentLoader[]): this {
        this.combinedLoader.registerLoaders(contentLoaders);
        return this;
    }

    public withTransformationProcessor(processor: TransformationProcessor): this {
        this._transformationProcessor = processor;
        return this;
    }

    public withDefaultTransformationProcessor(): this {
        const processor: SequentialProcessor = new SequentialProcessor(this._website);
        this.transformers.forEach((transformer: Transformer<any>) => processor.registerTransformer(transformer));
        return this.withTransformationProcessor(processor);
    }

    public withPageDispatcher(pageDispatcher: RendererDispatcher<Page>): this {
        this._pageDispatcher = pageDispatcher;
        return this;
    }

    get website(): Website {
        return this._website;
    }

    get store(): EntryStore {
        return this._entriesStore;
    }


    // // baya workflow // //

    public async run(): Promise<void> {
        // load
        winston.info("[weaver] starting to load entries");
        await this.combinedLoader.load().toPromise()
            .catch((err) => winston.error(err))
            .then(() => winston.info(`[weaver] finished loading ${this.store.size()} entries!`));
        // transform & render
        winston.info("[weaver] starting to transform and render");
        this.render();
        // deploy
        winston.info("[weaver] starting deployment");
        await this.deploy(this._deployment);
    }

    private render(): this {
        if (this._renderedWebsite) {
            throw new Error('Website has already been rendered! Cannot render again.');
        }

        // fixme: run hooks
        // if (this.preRenderHooks) {
        //     for (const hook of this.preRenderHooks) {
        //         hook.preRender(this.website);
        //     }
        // }

        // transform contents
        winston.info(`[weaver] About to transform ${this._toBeTransformed.toBeTransformed.length} entries.`);
        this._transformationProcessor.process(this._toBeTransformed);

        // render
        this._renderedWebsite = new WebsiteRenderer().render(this._website, this._pageDispatcher);
        return this;
    }

    private async deploy(deployment: Deployment): Promise<void> {
        if (!this._renderedWebsite) {
            throw new Error('Please call `Foreman.render()` before deploying.');
        }
        await deployment.deploy(this._renderedWebsite);
    }
}
