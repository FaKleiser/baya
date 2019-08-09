import {ContentLoader} from './content-loader.interface';
import {EntryFrame, EntryFrameStore} from '../entry';
import {Observable, Subject, from, forkJoin, throwError} from 'rxjs';
import {tap, finalize, catchError} from 'rxjs/operators';
import {FinalizeEntry} from './finalize-entry';
import {inject, injectable} from 'inversify';
import * as winston from 'winston';

/**
 * The combined loader ensures that content from multiple sources can be loaded properly.
 *
 * This loader is necessary to support references across multiple loaders. The combined loader works by:
 * 1. first loading all {@link EntryFrame}s from all loaders,
 * 2. and then finalizing the frames (i.e. establishing the references)
 */
@injectable()
export class CombinedLoader {

    private _loaders: ContentLoader[] = [];


    constructor(@inject(FinalizeEntry) private finalizeEntry: FinalizeEntry,
                @inject(EntryFrameStore) private entryFrameStore: EntryFrameStore) {
    }

    public registerLoader(loader: ContentLoader): this {
        this._loaders.push(loader);
        return this;
    }

    public registerLoaders(loaders: ContentLoader[]): this {
        loaders.forEach((loader: ContentLoader) => this.registerLoader(loader));
        return this;
    }

    public load(): Observable<void> {
        const loadingComplete: Subject<void> = new Subject();

        // initialize our frames by loader map - this will be used to finalize all frames once all loaders finished loading the frames
        const framesByLoader: Map<ContentLoader, EntryFrame<any>[]> = new Map();
        this._loaders.forEach(loader => framesByLoader.set(loader, []));

        // now load all frames of all loaders
        winston.info(`[combined-loader] Starting to combine ${this._loaders.length} loader(s).`);
        const loaderObservables: Observable<EntryFrame<any>>[] = this._loaders.map((loader) => {
            return loader.loadFrames().pipe(
                // first: store it in the store
                tap((frame: EntryFrame<any>) => this.entryFrameStore.store(frame)),
                tap((frame: EntryFrame<any>) => framesByLoader.get(loader).push(frame))
            )
        });
        forkJoin(...loaderObservables).pipe(
            finalize(() => winston.info(`Loaded a total of '${Array.from(framesByLoader.values()).reduce((sum, frames) => sum + frames.length, 0)}' frames from '${this._loaders.length}' loaders`)),
            catchError((err: any) => {
                loadingComplete.error(err);
                return throwError(err);
            })
        ).subscribe(() => {

            // once we have all frames, run the finalize step to complete all references
            const finalizeObservables: Observable<EntryFrame<any>>[] = this._loaders.map((loader) => {
                return from(framesByLoader.get(loader)).pipe(
                    // finalize cross references
                    tap((frame: EntryFrame<any>) => loader.finalizeFrame(frame, this.entryFrameStore, this.finalizeEntry)),
                    finalize(() => `Finalized all entries for loader '${loader.constructor.name}'`)
                )
            });
            forkJoin(...finalizeObservables).pipe(
                finalize(() => `Entry loading finished`),
                catchError((err: any) => {
                    loadingComplete.error(err);
                    return throwError(err);
                })
            ).subscribe(() => {
                loadingComplete.next();
                loadingComplete.complete();
            });

        });

        return loadingComplete;
    }

}
