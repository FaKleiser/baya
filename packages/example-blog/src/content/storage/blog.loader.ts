import {
    EntryData,
    FilesystemAccess,
    FileSystemLoader,
    FileSystemStructure,
    MetadataLocation
} from '@baya/loader-filesystem';
import {
    ContentLoader,
    EntryFrame,
    EntryFrameStore,
    EntryStore,
    FramedEntryFactory,
    Language,
    TransformationQueue
} from '@baya/core';
import {inject, injectable, interfaces} from 'inversify';
import {TagEntry} from '../entry/tag/tag.entry';
import {BlogPostEntry} from '../entry/blog-post/blog-post.entry';

const path = require('path');

@injectable()
export class BlogLoaderProvider {


    constructor(@inject(FileSystemLoader) private loaderFactory: interfaces.Factory<FileSystemLoader>,
                @inject(FilesystemAccess) private fsa: FilesystemAccess) {
    }

    public provideLoader(): ContentLoader {
        // describe file system
        const structure: FileSystemStructure = new FileSystemStructure();
        structure.match('tags/**/*.yml')
            .failOnNoMetadata()
            .metadataLocation(MetadataLocation.SLUG)
            .extractLanguage(new Language('EN'))
            .extractType((data: EntryData) => TagEntry);
        structure.match('posts/*/meta.yml')
            .failOnNoMetadata()
            .hasTextContent()
            .hasTitleImage()
            .extractLanguage(new Language('EN'))
            .extractType((data: EntryData) => BlogPostEntry);
        return this.loaderFactory.apply(this.loaderFactory, [structure, this.fsa]);
    }
}
