import {RelativePath} from './relative-path';

describe('RelativePath', () => {

    let path: RelativePath;
    let path2: RelativePath;
    let path3: RelativePath;

    test('Can create from empty path', () => {
        path = RelativePath.fromString('');
        expect(path.toString()).toBe('');

        path = RelativePath.fromString('/');
        expect(path.toString()).toBe('');

        path = RelativePath.fromString('///////');
        expect(path.toString()).toBe('');
    });

    test('Can create from empty path with anchor', () => {
        path = RelativePath.fromString('#anchor');
        expect(path.toString()).toBe('#anchor');

        path = RelativePath.fromString('/#anchor');
        expect(path.toString()).toBe('#anchor');

        path = RelativePath.fromString('///////#foo');
        expect(path.toString()).toBe('#foo');
    });

    test('Can create from valid path', () => {
        path = RelativePath.fromString('sample');
        expect(path.toString()).toBe('sample/');

        path = RelativePath.fromString('/sample');
        expect(path.toString()).toBe('sample/');

        path = RelativePath.fromString('/foo/bar/baz/test');
        expect(path.toString()).toBe('foo/bar/baz/test/');

        path = RelativePath.fromString('//////////foo//////bar//////baz/test///////');
        expect(path.toString()).toBe('foo/bar/baz/test/');
    });

    test('Cannot create from path with special characters', () => {
        expect(() => RelativePath.fromString('foo/äöüß/bar')).toThrow();
    });

    test('Can create from valid path with anchor', () => {
        path = RelativePath.fromString('sample#foo');
        expect(path.toString()).toBe('sample/#foo');

        path = RelativePath.fromString('/sample#bar');
        expect(path.toString()).toBe('sample/#bar');

        path = RelativePath.fromString('/foo/bar/baz/test/#baz');
        expect(path.toString()).toBe('foo/bar/baz/test/#baz');
    });


    test('Can create from parts', () => {
        path = RelativePath.fromParts(['sample']);
        expect(path.toString()).toBe('sample/');

        path = RelativePath.fromParts(['sample', 'foo']);
        expect(path.toString()).toBe('sample/foo/');

        path = RelativePath.fromParts(['foo', 'bar', 'baz', 'test']);
        expect(path.toString()).toBe('foo/bar/baz/test/');
    });

    test('Can create from parts with anchor', () => {
        path = RelativePath.fromParts(['sample'], 'anchor');
        expect(path.toString()).toBe('sample/#anchor');

        path = RelativePath.fromParts(['sample', 'foo'], 'anchor');
        expect(path.toString()).toBe('sample/foo/#anchor');

        path = RelativePath.fromParts(['foo', 'bar', 'baz', 'test'], 'anchor');
        expect(path.toString()).toBe('foo/bar/baz/test/#anchor');
    });

    test('Can create from parts with slashes', () => {
        path = RelativePath.fromParts(['foo/bar/', '/baz///test'], 'anchor');
        expect(path.toString()).toBe('foo/bar/baz/test/#anchor');
    });

    test('Can concatenate two paths', () => {
        path = RelativePath.fromString('first/path#foo');
        path2 = RelativePath.fromString('/second/path#bar');
        path3 = path.concat(path2);
        expect(path).not.toBe(path2);
        expect(path).not.toBe(path3);
        expect(path2).not.toBe(path3);

        expect(path3.toString()).toBe('first/path/second/path/#bar');
    });

    test('toString() adds trailing slashes, but only if there is no file ending', () => {
        path = RelativePath.fromString('first/path#foo');
        expect(path.toString()).toBe('first/path/#foo');

        path = RelativePath.fromString('first/img.jpg');
        expect(path.toString()).toBe('first/img.jpg');

        path = RelativePath.fromString('some/index.html#test');
        expect(path.toString()).toBe('some/index.html#test');
    });
});

