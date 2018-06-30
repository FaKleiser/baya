import {AbstractHtmlPageModule} from './abstract-html-page-module';

describe('AbstractHtmlPageModule', () => {

    class FooWebsiteModule extends AbstractHtmlPageModule {
    }

    test('Can return the class name as module name', () => {
        expect(new FooWebsiteModule().moduleName()).toBe('FooWebsiteModule');
    });

});
