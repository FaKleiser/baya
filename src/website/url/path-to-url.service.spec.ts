import {RelativePath} from './relative-path';
import {PathToUrlOptions, PathToUrlService, UrlProtocol} from './path-to-url.service';

describe('PathToUrlService', () => {

    let toUrl: PathToUrlService;
    let options: PathToUrlOptions;

    beforeEach(() => {
        toUrl = new PathToUrlService({
            domain: 'example.com',
            protocol: UrlProtocol.HTTP,
            trailingSlash: false,
        });
    });

    test('Can detect options from simple domain base url', () => {
        options = PathToUrlService.optionsFromBaseUrl('example.com');
        expect(options.basePath).toBeUndefined();
        expect(options.protocol).toBe(UrlProtocol.HTTP);
        expect(options.domain).toBe('example.com');
    });

    test('Can detect options from simple domain base url with protocol', () => {
        options = PathToUrlService.optionsFromBaseUrl('https://example.com/');
        expect(options.basePath).toBeUndefined();
        expect(options.protocol).toBe(UrlProtocol.HTTPS);
        expect(options.domain).toBe('example.com');
    });

    test('Can detect options from domain with base path', () => {
        options = PathToUrlService.optionsFromBaseUrl('www.foo.example.com/baz/bar/');
        expect(options.basePath).toBeInstanceOf(RelativePath);
        expect(options.basePath.toString()).toEqual(RelativePath.fromString('baz/bar').toString());
        expect(options.protocol).toBe(UrlProtocol.HTTP);
        expect(options.domain).toBe('www.foo.example.com');
    });

    test('Fails to create URL if no domain is set', () => {
        toUrl = new PathToUrlService();
        expect(() => toUrl.absolute(RelativePath.fromString(''))).toThrow();
    });

    test('Can create URL from path', () => {
        expect(toUrl.absolute(RelativePath.fromString(''))).toBe('http://example.com');
        expect(toUrl.absolute(RelativePath.fromString('foo'))).toBe('http://example.com/foo');
        expect(toUrl.absolute(RelativePath.fromString('foo/bar#baz'))).toBe('http://example.com/foo/bar#baz');
    });

    test('Can create URL without/with trailing slashes from path', () => {
        expect(toUrl.absolute(RelativePath.fromString(''), {trailingSlash: false})).toBe('http://example.com');
        expect(toUrl.absolute(RelativePath.fromString('foo'), {trailingSlash: false})).toBe('http://example.com/foo');
        expect(toUrl.absolute(RelativePath.fromString('foo/bar#baz'), {trailingSlash: false})).toBe('http://example.com/foo/bar#baz');

        expect(toUrl.absolute(RelativePath.fromString(''), {trailingSlash: true})).toBe('http://example.com/');
        expect(toUrl.absolute(RelativePath.fromString('foo'), {trailingSlash: true})).toBe('http://example.com/foo/');
        expect(toUrl.absolute(RelativePath.fromString('foo/bar#baz'), {trailingSlash: true})).toBe('http://example.com/foo/bar/#baz');
    });

    test('Can create URL with different protocols', () => {
        expect(toUrl.absolute(RelativePath.fromString('foo/bar#baz'), {
            protocol: UrlProtocol.HTTP
        })).toBe('http://example.com/foo/bar#baz');
        expect(toUrl.absolute(RelativePath.fromString('foo/bar#baz'), {
            protocol: UrlProtocol.HTTPS
        })).toBe('https://example.com/foo/bar#baz');
        expect(toUrl.absolute(RelativePath.fromString('foo/bar#baz'), {
            protocol: UrlProtocol.PROTOCOL_RELATIVE
        })).toBe('//example.com/foo/bar#baz');
    });
});

