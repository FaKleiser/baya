import {AssetEntry, Entry} from '@baya/core';
import {EntryData} from '../';
import {MetadataLocation} from './';
import {BaseEntry} from '../../../core/src/content/entry';
import {Language} from '../../../core/src/platform/valueobject';

export interface FileSystemLoaderOptions {
    /**
     * Callback to extract meta data from the directory path.
     * By default, the directory name without organizational prefix is used.
     *
     * @param {string} path to the directory
     */
    onDirectoryPath?: (directoryPath: string) => EntryData;

    /**
     * Define where to look for metadata.
     */
    metadataLocation?: MetadataLocation;

    /**
     * Fails to load if no metadata is found.
     */
    failOnNoMetadata?: boolean;

    /**
     * Callback to enrich or transform the loaded metadata.
     */
    onMetadata?: (metadata: EntryData) => EntryData;

    /**
     * Turns the {@link EntryData} into the ID the entry will have.
     */
    idFor?: (metadata: EntryData) => string;

    /**
     * If true, the loader tries to load text content into the `content` property.
     *
     * Content files need to fulfill any of the following criteria:
     * - <SLUG>.md: loaded as markdown
     */
    hasTextContent?: boolean;

    /**
     * If true, the loader tries to load a title image into the `image` property.
     *
     * Title image files need to be in any of the following locations:
     * - <SLUG>.png
     * - <SLUG>.jpg
     * - <SLUG>.jpeg
     */
    hasTitleImage?: boolean;

    /**
     * Turns all loaded entry data into an {@link BaseEntry}.
     *
     * @deprecated
     */
    onEntryData?: (data: EntryData) => BaseEntry;

    /**
     * Determine the entry type to load.
     */
    entryType?: (entryData: EntryData) => typeof BaseEntry | typeof BaseEntry;

    /**
     * Determine entry language.
     */
    entryLanguage?: (entryData: EntryData) => Language | Language;

    /**
     * If true, the loader will load assets contained in the directory.
     *
     * Assets will be passed to `onAsset()`.
     */
    loadAssets?: boolean;

    /**
     * The callback will be called for each asset found in the directory.
     *
     * The file path is the path to the file and the data contains all data
     * required to pass to {@link AssetEntry} to create a new instance.
     */
    onAsset?: (entryId: string, filePath: string, data: any) => AssetEntry;
}
