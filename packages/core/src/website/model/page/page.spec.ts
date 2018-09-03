import {Page} from './page';
import {Website} from '../website';
import {RelativePath} from '../../url/relative-path';
import mock = jest.mock;
import {PathToUrlService} from '../../url/path-to-url.service';

describe('Page', () => {

    const baseUrl: string = 'baseUrl', hostName: string = 'hostName';
    const website = new Website({baseUrl, hostName}, undefined);


    test('we can create a page with a url', () => {
        const path = RelativePath.fromString('/url');

        const p: Page = new class extends Page {
            constructor() {
                super(website, path);
            }
        };

        expect(p).toBeInstanceOf(Page);
        expect(p.url).toBe(path);
        expect(p.website).toBe(website);
    });

    test('we cannot create a page without url', () => {
        expect(() => {
            const p: Page = new class extends Page {
                constructor() {
                    super(website, undefined);
                }
            };
        }).toThrow();
    })
});
