import {Page} from './page';
import {Website} from '../website';
import {RelativePath} from '../../url/relative-path';

describe('Page', () => {

    const baseUrl: string = 'baseUrl', hostName: string = 'hostName';
    const website = new Website({baseUrl, hostName}, undefined);


    test('we can create a page with a url', () => {
        const path = RelativePath.fromString('/url');

        const p: Page = new class extends Page {
            constructor() {
                super(path);
            }
        };

        expect(p).toBeInstanceOf(Page);
        expect(p.url).toBe(path);
    });

    test('we cannot create a page without url', () => {
        expect(() => {
            const p: Page = new class extends Page {
                constructor() {
                    super(undefined);
                }
            };
        }).toThrow();
    })
});
