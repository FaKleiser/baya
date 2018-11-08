import {ContentLoader} from './content-loader.interface';
import {EntryFrame, EntryFrameStore} from '../entry';
import {forkJoin, Observable, of} from 'rxjs';
import {map, zip, flatMap} from 'rxjs/operators';
import {FinalizeEntry} from './finalize-entry';
import {inject, injectable} from 'inversify';
import * as winston from 'winston';

interface LoadedFrames {
    loader: ContentLoader,
    frames: Observable<EntryFrame<any>>
}

@injectable()
export class CombinedLoader {

    private _loaders: ContentLoader[] = [];


    constructor(@inject(FinalizeEntry) private finalize: FinalizeEntry,
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
        // FIXME: ensure all loaders first load frames and then finalize!
        winston.info(`Starting to combine ${this._loaders.length} loader(s).`, {origin: CombinedLoader})
        return forkJoin(...this._loaders.map((loader: ContentLoader) => {
            return of(loader).pipe(
                map((loader: ContentLoader) => this.doLoadFrames(loader)),
                flatMap((loadedFrames: LoadedFrames) => this.doFinalizeFrames(loadedFrames)),
                map(() => undefined)
            );
        }));
    }

    private doLoadFrames(loader: ContentLoader): LoadedFrames {
        return {
            loader: loader,
            frames: loader.loadFrames(),
        };
    }

    private doFinalizeFrames(loadedFrames: LoadedFrames): Observable<void> {
        return loadedFrames.frames.pipe(
            map((frame: EntryFrame<any>) => {
                loadedFrames.loader.finalizeFrame(frame, this.entryFrameStore, this.finalize);
            })
        );
    }

}
