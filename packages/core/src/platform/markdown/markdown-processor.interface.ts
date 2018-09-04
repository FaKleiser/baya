/**
 * Turns markdown to HTML.
 */
export interface MarkdownProcessor {

    process(markdown: string): string;
}
