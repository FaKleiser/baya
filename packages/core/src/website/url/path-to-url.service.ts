import {injectable, unmanaged} from 'inversify';
import {RelativePath} from './relative-path';
import {defaults} from 'lodash';

export enum UrlProtocol {
    HTTP = 'http://',
    HTTPS = 'https://',
    PROTOCOL_RELATIVE = '//',
}

export interface PathToUrlOptions {
    /**
     * The type of protocols URLs should have.
     */
    protocol?: UrlProtocol;
    /**
     * True if generated URLs should have a trailing slash.
     */
    trailingSlash?: boolean;
    /**
     * The domain part of the URLs to generate from {@link RelativePath}s.
     *
     * Examples:
     * - www.example.com
     * - my.sub.domain.example.com
     * - example.com
     */
    domain?: string;
    /**
     * The base path following the TLD. Any {@link RelativePath}s given to this
     * service are prefixed by this base path.
     *
     * Examples:
     * - foo (yields example.com/foo/<paths>)
     * - foo/bar (yields example.com/foo/bar/<paths>)
     */
    basePath?: RelativePath;
}

@injectable()
export class PathToUrlService {

    private defaultOptions: PathToUrlOptions = {
        protocol: UrlProtocol.HTTP,
        trailingSlash: true,
    };

    constructor(@unmanaged() defaultOptions?: PathToUrlOptions) {
        this.defaultOptions = defaults(defaultOptions || {}, this.defaultOptions);
    }

    public static optionsFromBaseUrl(baseUrl: string): PathToUrlOptions {
        const options: PathToUrlOptions = {
            protocol: UrlProtocol.HTTP,
        };

        let curBaseUrl: string = baseUrl;
        curBaseUrl = curBaseUrl.toLocaleLowerCase().replace(/(\/+)$/, '');

        // check and strip protocol
        if (curBaseUrl.startsWith('https://')) {
            options.protocol = UrlProtocol.HTTPS;
        }
        curBaseUrl = curBaseUrl.replace(/^(http(s)?:)?\/\//i, '');

        // check and strip basePath
        const basePathSlash: number = curBaseUrl.indexOf('/');
        if (-1 !== basePathSlash) {
            options.basePath = RelativePath.fromString(curBaseUrl.substr(basePathSlash));
            curBaseUrl = curBaseUrl.substr(0, basePathSlash);
        }

        // all that is left is the domain
        if (!curBaseUrl) {
            throw new Error(`It seems that the given baseUrl '${baseUrl}'`);
        }
        options.domain = curBaseUrl;

        return options;
    }

    public absolute(path: RelativePath, options?: PathToUrlOptions): string {
        const o: PathToUrlOptions = defaults(options || {}, this.defaultOptions);

        if (!o.domain) {
            throw new Error(`Missing domain in PathToUrlService options. Please define a domain in the options.`);
        }
        let pathString: string;
        if (o.basePath instanceof RelativePath) {
             pathString = o.basePath.concat(path).toString(o.trailingSlash);
        } else {
            pathString = path.toString(o.trailingSlash);
        }
        const slashAfterDomain: string = ((pathString || o.trailingSlash) ? '/' : '');
        return `${o.protocol}${o.domain}${slashAfterDomain}${pathString}`;
    }
}
