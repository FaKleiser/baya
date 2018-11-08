import {ContainerModule, interfaces} from 'inversify';
import {TransformationQueue} from './transformation';
import {EntryStore, FramedEntryFactory} from './entry';
import {MetadataStorage} from './metadata';
import {EntryFrameStore} from './entry/frame';
import {defaultMetadataStorage} from './metadata/default-metadata-storage';
import {CombinedLoader} from './storage/combined.loader';
import {FinalizeEntry} from './storage/finalize-entry';

export const ContentModule: ContainerModule = new ContainerModule((bind: interfaces.Bind) => {
    bind<TransformationQueue>(TransformationQueue).toSelf().inSingletonScope();
    bind<EntryStore>(EntryStore).toSelf().inSingletonScope();
    bind<EntryFrameStore>(EntryFrameStore).toSelf();
    bind<FramedEntryFactory>(FramedEntryFactory).toSelf();
    bind<MetadataStorage>(MetadataStorage).toConstantValue(defaultMetadataStorage);
    bind<CombinedLoader>(CombinedLoader).toSelf();
    bind<FinalizeEntry>(FinalizeEntry).toSelf();
});
