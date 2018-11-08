/**
 * Interface explicitly types the key-value map of metadata used throughout the loading.
 */
export interface EntryData {
    /** relative path to the directory the entry is stored in */
    directory: string;
    /** the main identifier of the entry (which is typically the directory name and later used as part of the URL) */
    slug: string;
    /** the organizing prefix the entry directory name may contain */
    organizingPrefix?: string;
    /** if the entry supports rich content, then the content is stored here */
    content?: string;
    /** if the entry has a title image, the title image ID will be stored here */
    image?: string;

    [key: string]: any;
}
