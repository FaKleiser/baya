import {FileSystemStructure} from './file-system-structure';
import {EntryData, FileSystemLoaderOptions, MetadataLocation} from '@baya/loader-filesystem';
import {AssetEntry, BaseEntry, Language} from '@baya/core';

export class EntryStructure {

    private _options: FileSystemLoaderOptions = {};

    constructor(private structure: FileSystemStructure,
                public readonly glob: string) {
    }

    get options(): FileSystemLoaderOptions {
        return this._options;
    }

// // SETTINGS // //

    /**
     * Define where to look for entry metadata.
     *
     * @see MetadataLocation for details
     */
    public metadataLocation(location: MetadataLocation): this {
        this._options.metadataLocation = location;
        return this;
    }


    /**
     * Fails to load if no metadata is found.
     */
    public failOnNoMetadata(failOnNoMetadata: boolean = true): this {
        this._options.failOnNoMetadata = failOnNoMetadata;
        return this;
    }

    /**
     * If true, the loader tries to load text content into the `content` property.
     *
     * Content files need to fulfill any of the following criteria:
     * - <SLUG>.md: loaded as markdown
     */
    public hasTextContent(hasTextContent: boolean = true): this {
        this._options.hasTextContent = hasTextContent;
        return this;
    }

    /**
     * If true, the loader tries to load a title image into the `image` property.
     *
     * Title image files need to be in any of the following locations:
     * - <SLUG>.png
     * - <SLUG>.jpg
     * - <SLUG>.jpeg
     */
    public hasTitleImage(hasTitleImage: boolean = true): this {
        this._options.hasTitleImage = hasTitleImage;
        return this;
    }

    /**
     * If true, the loader will load assets contained in the directory.
     *
     * Assets will be passed to `onAsset()`.
     */
    public loadAssets(loadAssets: boolean = true): this {
        this._options.loadAssets = loadAssets;
        return this;
    }


    // // HOOKS // //

    public onDirectoryPath(callback: (directoryPath: string) => EntryData): this {
        this._options.onDirectoryPath = callback;
        return this;
    }

    public onMetadata(callback: (metadata: EntryData) => EntryData): this {
        this._options.onMetadata = callback;
        return this;
    }

    public onAsset(callback: (entryId: string, filePath: string, data: any) => AssetEntry): this {
        this._options.onAsset = callback;
        return this;
    }


    // // EXTRACTORS // //

    public extractID(extractor: (metadata: EntryData) => string): this {
        this._options.extractID = extractor;
        return this;
    }

    public extractType(extractor: ((entryData: EntryData) => typeof BaseEntry) | typeof BaseEntry): this {
        this._options.extractType = extractor;
        return this;
    }

    public extractLanguage(extractor: ((entryData: EntryData) => Language) | Language): this {
        this._options.extractLanguage = extractor;
        return this;
    }
}
