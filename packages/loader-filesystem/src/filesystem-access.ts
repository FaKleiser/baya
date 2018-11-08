import {injectable, unmanaged} from 'inversify';
import {GlobSync, hasMagic, IGlobBase} from 'glob';
import * as winston from 'winston';
import * as yaml from 'js-yaml';
import {Observable} from 'rxjs';
import {Optional} from '@baya/core';
import path = require('path');
import fs = require('fs');

const mime: any = require('mime-types');

export interface Markdown {
}

export interface FileInfo {
    size: number;
    mimeType: string;
    fileName: string;
    accessTime: Date;
    modifiedTime: Date;
    changeTime: Date;
    createdTime: Date;
}

/**
 * Wraps typical methods to access the file system for writing loaders to load
 * from the file system.
 */
@injectable()
export class FilesystemAccess {

    private _rootDir: string;

    constructor(@unmanaged() _rootDir: string) {
        this._rootDir = path.normalize(path.resolve(_rootDir));
        if (!this._rootDir || !fs.existsSync(this._rootDir)) {
            throw new Error(`FileSystem loader cannot target non-existing directory '${_rootDir}' (resolved to '${this._rootDir}')`);
        }
    }

    /**
     * Provide a glob pattern and the method will call the loadCallback for each match.
     */
    public async glob(pattern: string, loadCallback: (fileName: string) => Promise<void>): Promise<void> {
        const candidates: IGlobBase = new GlobSync(pattern, {
            cwd: this._rootDir,
        });

        return Promise.all(candidates.found.map(async (match: string) => {
            winston.debug(`About to load ${match}`);
            return await loadCallback(match).catch((err) => {
                throw new Error(`Failed to load ${match} due to: ${err}`);
            });
        })).then(() => {
        });
    }

    /**
     * Given an arbitrary number of strings representing a path relative to the
     * file system access root, this method resolves them to an absolute path
     * on the file system.
     *
     * E.g. `resolve('some', 'path.yml')` will return `<ROOT>/some/path.yml`
     */
    public resolve(...parts: string[]): string {
        const allParts: string[] = [].concat(parts);
        allParts.unshift(this.rootDir);
        const fullPath: string = path.normalize(path.join.apply(undefined, allParts));

        if (-1 === fullPath.indexOf(this.rootDir)) {
            throw new Error(`Possible path injection detected! Tried to access '${fullPath}' outside`
                + `of root '${this.rootDir}' after resolving given path parts: [${parts.join(', ')}]`);
        }
        return fullPath;
    }

    /**
     * List all files of a directory.
     */
    public list(directory: string): string[] {
        if (hasMagic(directory)) {
            throw new Error(`Cannot list directory contents when Glob syntax is used: '${directory}'!`);
        }
        const candidates: IGlobBase = new GlobSync(`${directory}/*`, {
            cwd: this._rootDir,
            nodir: true
        });
        return candidates.found;
    }

    public loadYaml(...parts: string[]): Optional<any> {
        const yamlFile: string = this.resolve.apply(this, parts);
        if (fs.existsSync(yamlFile)) {
            const loadedYaml: any = yaml.safeLoad(fs.readFileSync(yamlFile, 'utf-8'));
            if (loadedYaml) {
                return Optional.of(loadedYaml);
            }
        }
        return Optional.empty();
    }

    public loadMarkdown(...parts: string[]): Optional<Markdown> {
        const mdFilePath: string = this.resolve.apply(this, parts);
        if (fs.existsSync(mdFilePath)) {
            const loadedMarkdown: Markdown = fs.readFileSync(mdFilePath, 'utf-8');
            if (loadedMarkdown) {
                return Optional.of(loadedMarkdown);
            }
        }
        return Optional.empty();
    }

    /**
     * Returns the {@link FilesystemAccess} root directory.
     */
    public get rootDir(): string {
        return this._rootDir;
    }

    /**
     * Returns file information for the given file or undefined if the resolved
     * file is not a file or does not exist.
     */
    public fileInfo(...parts: string[]): FileInfo {
        const filePath: string = this.resolve.apply(this, parts);
        if (!fs.existsSync(filePath)) {
            return undefined;
        }

        const stats: fs.Stats = fs.statSync(filePath);
        if (!stats.isFile()) {
            return undefined;
        }
        return {
            fileName: path.basename(filePath),
            size: stats.size,
            mimeType: mime.lookup(filePath),
            accessTime: stats.atime,
            changeTime: stats.ctime,
            createdTime: stats.birthtime,
            modifiedTime: stats.mtime,
        };
    }

    /**
     * Access the file contents by resolving the returned observable.
     */
    public fileContents(...parts: string[]): Observable<string> {
        const filePath: string = this.resolve.apply(this, parts);
        if (!fs.existsSync(filePath)) {
            throw new Error(`File '${filePath}' resolved from '${parts.join(', ')}' does not exist!`);
        }

        return new Observable(observer => {
            fs.readFile(filePath, undefined, (err, data) => {
                if (err) {
                    winston.error(`Error reading file contents of ${filePath}: ${err.message}`);
                    observer.error(err);
                } else {
                    observer.next(data.toString());
                }
                observer.complete();
            });
        });
    }
}
