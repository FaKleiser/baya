import {ContentLoader} from './content-loader.interface';
import {EntryFrame, EntryFrameStore} from '../entry';
import {Observable, Subject, zip} from 'rxjs';
import {FinalizeEntry} from './finalize-entry';
import {inject, injectable} from 'inversify';
import * as winston from 'winston';

interface LoadedFrames {
    loader: ContentLoader,
    frames: EntryFrame<any>[]
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
        const publisher = new Subject<void>();
        this.loadit()
            .then(() => {
                publisher.next();
                publisher.complete();
            })
            .catch((err) => publisher.error(err));
        return publisher;
    }

    private async loadit(): Promise<void> {
        winston.info(`[combined-loader] Starting to combine ${this._loaders.length} loader(s).`);
        // first load frames
        const loadedFrames: LoadedFrames[] = [];
        for (const loader of this._loaders) {
            loadedFrames.push(await this.doLoadFrames2(loader));
        }

        // then finalize
        winston.info(`[combined-loader] Starting to finalize '${this._loaders.length}' loader(s) for '${loadedFrames.length}' frames.`);
        for (const loaded of loadedFrames) {
            for (const frame of loaded.frames) {
                loaded.loader.finalizeFrame(frame, this.entryFrameStore, this.finalize);
            }
        }
    }

    private async doLoadFrames2(loader: ContentLoader): Promise<LoadedFrames> {
        return zip(loader.loadFrames())
            .toPromise()
            .then((loadedFrames: EntryFrame<any>[]) => {
                if (!loadedFrames) {
                    loadedFrames = [];
                }
                winston.info(`[combined-loader] Loaded ${loadedFrames.length} frames from ${loader.constructor.name}`);
                winston.info(JSON.stringify(loadedFrames[0]));
                return {
                    loader: loader,
                    frames: loadedFrames
                }
            });
    }

    // private doLoadFrames(loader: ContentLoader): Observable<LoadedFrames> {
    //     combineAll(loader.loadFrames());
    //     return loader.loadFrames().pipe(
    //         // map((loadedFrame: EntryFrame<any>): LoadedFrames => {
    //         //     winston.info(`[combined-loader] Loaded frame ${loadedFrame.entry.id}`);
    //         //     return {
    //         //         loader: loader,
    //         //         frame: loadedFrame
    //         //     }
    //         // }),
    //         combineAll((loadedFrames: EntryFrame<any>[]): LoadedFrames => {
    //             return {
    //                 loader: loader,
    //                 frames: loadedFrames
    //             }
    //         }),
    //         tap((loadedFrames: LoadedFrames): void => {
    //             winston.info(`[combined-loader] Loaded ${loadedFrames.frame.entry.id}`);
    //         })
    //     );
    // }

    // private doFinalizeFrames(loadedFrames: LoadedFrames): Observable<void> {
    //     return of(loadedFrames.frame).pipe(
    //         map((frame: EntryFrame<any>) => {
    //             loadedFrames.loader.finalizeFrame(frame, this.entryFrameStore, this.finalize);
    //         })
    //     );
    // }

}
