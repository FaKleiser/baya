import {EntryData, FilesystemAccess, FileSystemLoader, MetadataLocation} from '@baya/loader-filesystem';
import {EntryFrame, EntryFrameStore, EntryStore, FramedEntryFactory, Language, TransformationQueue} from '@baya/core';
import {inject, injectable} from 'inversify';
import {TagEntry} from '../entry/tag/tag.entry';
import {Observable, of} from 'rxjs';
import * as winston from 'winston';

const path = require('path');

@injectable()
export class BlogLoader extends FileSystemLoader {


    constructor(@inject(EntryFrameStore) entryFrameStore: EntryFrameStore,
                @inject(FramedEntryFactory) entryFactory: FramedEntryFactory,
                @inject(FilesystemAccess) fsa: FilesystemAccess) {
        super(entryFrameStore, entryFactory, fsa);
    }

    public loadFrames(): Observable<EntryFrame<any>> {
        return of(
            this.createEntry(TagEntry, 'tag1', new Language('EN'), {
                slug: 'slug-tag1',
                title: 'title-tag1',
            }),
            this.createEntry(TagEntry, 'tag2', new Language('EN'), {
                slug: 'slug-tag2',
                title: 'title-tag2',
            })
        );
    }

    private async loadTags(): Promise<void> {
        return this._fsa.glob('tags/**/*.yml', async (file: string): Promise<void> => {
            this.loadFromDirectory(path.dirname(file), {
                hasTextContent: false,
                failOnNoMetadata: true,
                metadataLocation: MetadataLocation.SLUG,
                entryLanguage: (data: EntryData) => new Language('EN'),
                entryType: (data: EntryData) => TagEntry,
            });
        });
        /*
        new FSLCreator()
            .match('tags/*.yml')
            .
         */
    }
}
