import {defaults, filter} from 'lodash';
import {FileInfo, FilesystemAccess, Markdown} from './filesystem-access';
import {injectable} from 'inversify';
import * as winston from 'winston';
import * as md5 from 'md5';
import {
    AssetEntry,
    BaseEntry,
    Entry,
    EntryFrame,
    EntryFrameStore,
    FramedEntryFactory,
    FramedEntryLoader,
    Language,
    Optional
} from '@baya/core';
import {FileSystemLoaderOptions, MetadataLocation} from './config';
import {EntryData} from './entry-data';
import path = require('path');

const transliterate: any = require('transliteration/lib/node/transliterate').default;

/**
 * The FileSystemLoader helps to load entries stored in a file system by
 * following certain conventions on how the file system is organized.
 *
 * The following conventions are used:
 *
 * - Each entry is stored in a single folder, which is also used as the ENTRY_ID.
 * - The folder supports a categorization/ordering prefix separated by an underscore from the ENTRY_ID.
 * - An entry may contain a single metadata file, either in yaml or json, called either `meta.yml` or `<ENTRY_ID>.yml`.
 * - By default, a single text content file is supported, which needs to be called `<ENTRY_ID>.md` or `<ENTRY_ID>.adoc`.
 * - No conventions about hierarchical composition, expects all files for an entry in it's folder.
 *
 * The loading of a specific directory can be customized by passing
 * {@link FileSystemLoaderOptions}, which also provide the ability to define
 * callbacks to customize any steps during the loading.
 */
@injectable()
export abstract class FileSystemLoader extends FramedEntryLoader {

    /** extracts organizational prefix and slug from a directory name */
    public static readonly DIRECTORY_SLUG_REGEX: RegExp = /(([a-z0-9-]+)_)?([a-z0-9-]+)$/;

    protected readonly _fsa: FilesystemAccess;

    private defaultLoaderOptions: FileSystemLoaderOptions = {
        metadataLocation: MetadataLocation.ALL,
        failOnNoMetadata: true,
        entryLanguage: null,
        entryType: null,
        onDirectoryPath: (directoryPath: string) => {
            const dirName: string = path.basename(directoryPath);
            const matches: RegExpExecArray = FileSystemLoader.DIRECTORY_SLUG_REGEX.exec(dirName);
            if (matches) {
                if (matches[2]) {
                    return {
                        directory: directoryPath,
                        slug: matches[3],
                        organizingPrefix: matches[2],
                    };
                }
                return {
                    directory: directoryPath,
                    slug: matches[3],
                };
            }
            // regex failed, lets use the directory name as slug.
            return {
                directory: directoryPath,
                slug: dirName,
            };
        },
        idFor: (metadata: EntryData): string => {
            return `filesystem:${metadata.directory}`;
        },
        hasTextContent: false,
        hasTitleImage: false,
    };

    constructor(entryFrameStore: EntryFrameStore,
                entryFactory: FramedEntryFactory,
                fsa: FilesystemAccess) {
        super(entryFrameStore, entryFactory);
        this._fsa = fsa;
    }

    protected loadFromDirectory(directory: string, loaderOptions?: FileSystemLoaderOptions): EntryFrame<any> {
        const options: FileSystemLoaderOptions = defaults(loaderOptions || {}, this.defaultLoaderOptions);

        // 1. load yaml metadata
        let data: EntryData = options.onDirectoryPath(directory);
        if (!data.slug) {
            throw new Error(`Couldn't determine slug for entry in directory '${directory}'.`);
        }
        winston.debug(`Loading metadata for entry with slug '${data.slug}' from ${directory}`);
        data = this.loadMetadata(directory, data, options);
        if (options.onMetadata) {
            data = options.onMetadata(data);
        }

        // 2. create id
        const entryId: string = options.idFor(data);
        let entryLanguage: Language;
        if ('function' == typeof entryLanguage) {
            entryLanguage = options.entryLanguage(data);
        } else {
            entryLanguage = <any> options.entryLanguage;
        }

        // 3. load assets
        let assets: AssetEntry[] = [];
        if (options.loadAssets) {
            assets = this.loadAssetsFromDirectory(directory, entryId, loaderOptions);
        }

        // 4. load content
        if (options.hasTextContent) {
            data = this.loadContent(directory, data);
        }

        // 5. load title image
        if (options.hasTitleImage) {
            data = this.loadTitleImage(assets, data);
        }

        // 6. determine entry type
        let entryType: typeof BaseEntry;
        if ('function' == typeof loaderOptions.entryType) {
            entryType = loaderOptions.entryType(data);
        } else {
            entryType = loaderOptions.entryType;
        }

        // 7. create entry
        return this.createEntry(entryType, entryId, entryLanguage, data);
    }

    /**
     * Gets all files in a directory, gathers the information required to
     * create an {@link AssetEntry} and calls the `onAsset` callback.
     */
    private loadAssetsFromDirectory(directory: string, entryId: string, loaderOptions: FileSystemLoaderOptions): AssetEntry[] {
        if (!loaderOptions.onAsset) {
            throw new Error(`The given FileSystemLoaderOptions require to load assets with 'loadAssets: true', but no 'onAsset' callback is defined.`);
        }
        const assets: AssetEntry[] = [];
        for (const file of this._fsa.list(directory)) {
            const normalizedFilename: string = transliterate(path.basename(file)).replace(/[^a-z0-9-_.]+/ig, '-').replace(/[-]{2,}/ig, '-');
            const info: FileInfo = this._fsa.fileInfo(file);
            const data: any = {
                content: this._fsa.fileContents(file),
                mimeType: info.mimeType,
                size: info.size,

                filename: normalizedFilename,
                directory: `/media/${md5(normalizedFilename + file)}`,

                title: normalizedFilename,
            };
            assets.push(loaderOptions.onAsset(entryId, file, data));
        }
        return filter(assets);
    }

    /**
     * Loads the metadata file of an entry in the following order:
     *
     * 1. <slug>.yml
     * 2. meta.yml
     */
    private loadMetadata(directory: string, metadata: EntryData, options: FileSystemLoaderOptions): EntryData {
        // 1. check slug file
        if (options.metadataLocation === MetadataLocation.ALL
            || options.metadataLocation === MetadataLocation.SLUG) {
            const loadedMetadata: Optional<any> = this._fsa.loadYaml(directory, `${metadata.slug}.yml`);
            if (loadedMetadata.has()) {
                return defaults(metadata, loadedMetadata.get());
            }
        }

        // 2. check meta.yml file
        if (options.metadataLocation === MetadataLocation.ALL
            || options.metadataLocation === MetadataLocation.META) {
            const loadedMetadata: Optional<any> = this._fsa.loadYaml(directory, `meta.yml`);
            if (loadedMetadata.has()) {
                return defaults(metadata, loadedMetadata.get());
            }
        }

        // 3. check if we should have loaded metadata
        if (options.failOnNoMetadata) {
            throw new Error(`No metadata file loaded for entry ${metadata.slug}`);
        } else {
            return metadata;
        }
    }

    /**
     * Load content from a markdown text file.
     */
    private loadContent(directory: string, data: EntryData): EntryData {
        const markdownFileName: string = `${data.slug}.md`;
        const markdown: Optional<Markdown> = this._fsa.loadMarkdown(directory, markdownFileName);
        const content: string = markdown.getOrThrow(`Couldn't load markdown content for entry in ${directory}`) as string;
        if (!content.startsWith('# ')) {
            throw new Error(`The main content file '${this._fsa.resolve(directory, markdownFileName)}' must start with a headline as follows: '# <HEADLINE>'`);
        }
        const titleSplit: string[] = content.split('\n');
        return defaults({
            title: titleSplit[0].replace('# ', '').trim(),
            content: titleSplit.slice(1).join('\n').trim()
        }, data);
    }

    private loadTitleImage(assets: AssetEntry[], data: EntryData): EntryData {
        for (const asset of assets) {
            switch (asset.filename) {
                case `${data.slug}.png`:
                case `${data.slug}.jpg`:
                case `${data.slug}.jpeg`:
                    data.image = asset.id;
                    return data;
            }
        }
        return data;
    }


}
