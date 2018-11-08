import {BaseEntry, EntryFrame, EntryFrameStore} from '../entry';
import {Observable} from 'rxjs';
import {FinalizeEntry} from './finalize-entry';

/**
 * Content in baya is loaded in two steps:
 * 1) all non-referencial properties are loaded to create unfinished object references
 * 2) all unfinished object references are fully initialized and cross-referenced
 */
export interface ContentLoader {

    /**
     * Loads the non-reference properties of everything that eventually will be an {@link Entry}.
     */
    loadFrames(): Observable<EntryFrame<any>>;

    /**
     * Populate entry references to fully initialize {@link EntryFrame}s to
     * {@link BaseEntry}s to establish the fully referenced content model.
     *
     * Note: the baya workflow ensures that this method will only receive
     * {@link EntryFrame}s loaded by this class.
     *
     * @param frame the {@link EntryFrame} to finalize and reference
     * @param entryFrameStore a store to access all other entry frame objects
     * @param finalize choose how to proceed with the {@link BaseEntry} in the baya workflow
     */
    finalizeFrame(frame: EntryFrame<any>,
                  entryFrameStore: EntryFrameStore,
                  finalize: FinalizeEntry): void;
}
