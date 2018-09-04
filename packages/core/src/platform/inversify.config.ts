import {ContainerModule, interfaces} from 'inversify';
import {PLATFORM_TYPES} from './platform-types';
import {MarkdownItPlugin, MarkdownItProcessor} from './markdown/markdownit';
import Context = interfaces.Context;

export const PlatformModule: ContainerModule = new ContainerModule((bind: interfaces.Bind) => {
    bind(PLATFORM_TYPES.MarkdownProcessor).toDynamicValue((ctx: Context) => {
        const plugins: MarkdownItPlugin[] = ctx.container.getAll(PLATFORM_TYPES.MarkdownItHelper) || [];
        return new MarkdownItProcessor(plugins, {
            html: true,
            highlight: (code: string, lang: string) => {
                const codeEscaped: string = code
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;');
                return `<pre class="line-numbers">`
                    + `<code class="language-${lang}">${codeEscaped}</code>`
                    + `</pre>`;
            }
        });
    });
});
