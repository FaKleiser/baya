import {ContainerModule, interfaces} from 'inversify';
import {FileSystemStructure} from './definition';
import {FileSystemLoader} from './file-system.loader';
import {FilesystemAccess} from './filesystem-access';
import {EntryFrameStore, FramedEntryFactory} from '@baya/core';


export const LoaderFilesystemModule: ContainerModule = new ContainerModule((bind: interfaces.Bind) => {
    bind(FileSystemLoader).toFactory<FileSystemLoader>((context: interfaces.Context) => {
        return (structure: FileSystemStructure, fsa: FilesystemAccess) => {
            return new FileSystemLoader(structure,
                fsa,
                context.container.get(EntryFrameStore),
                context.container.get(FramedEntryFactory));
        }
    });
});
