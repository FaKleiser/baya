import {inject, injectable, multiInject} from 'inversify';
import {Website} from '../website/model';
import {SequentialProcessor, TransformationProcessor} from '../content/transformation/processor';
import {RenderedWebsite} from '../website/renderer/website/rendered-website.model';
import {TYPES} from '../types';
import {EntryStore} from '../content/entry';
import {TransformationQueue, Transformer} from '../content/transformation';
import {RendererDispatcher} from '../website/renderer/renderer-dispatcher.service';
import {Page} from '../website/model/page/page';
import {PathToUrlService} from '../website/url/path-to-url.service';
import {ContentLoader} from '../content/storage';
import {WebsiteRenderer} from '../website/renderer/website/website-renderer.service';
import {Deployment} from '../deployment';
import {MarkdownProcessor} from '../platform/markdown';
import {PLATFORM_TYPES} from '../platform/platform-types';

/**
 * The weaver takes care of the static site generation workflow.
 */
@injectable()
export class Weaver {

    private _website: Website;
    private _transformationProcessor: TransformationProcessor;
    private _renderedWebsite: RenderedWebsite;

    constructor(@inject(TYPES.TBD) private config: any,
                @inject(EntryStore) private _entriesStore: EntryStore,
                @inject(TransformationQueue) private _toBeTransformed: TransformationQueue,
                @multiInject(TYPES.Transformer) private transformers: Transformer<any>[],
                @inject(TYPES.PageRenderer) private _pageDispatcher: RendererDispatcher<Page>,
                @inject(PLATFORM_TYPES.MarkdownProcessor) private markdownProcessor: MarkdownProcessor,
                @inject(PathToUrlService) private pathToUrlService: PathToUrlService) {
        this._website = new Website(this.config, pathToUrlService);
        this.withDefaultTransformationProcessor();
    }


    // == foreman workflow


    public async loadFrom(contentLoader: ContentLoader): Promise<void> {
        await contentLoader.load(this._entriesStore, this._toBeTransformed);
    }

    public render(): this {
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
        this._transformationProcessor.process(this._toBeTransformed);

        // render
        this._renderedWebsite = new WebsiteRenderer().render(this._website, this._pageDispatcher);
        return this;
    }

    public async deploy(deployment: Deployment): Promise<void> {
        if (!this._renderedWebsite) {
            throw new Error('Please call `Foreman.render()` before deploying.');
        }
        await deployment.deploy(this._renderedWebsite);
    }


    // == foreman customizations

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
}
