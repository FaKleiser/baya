export interface Renderer<T> {
    /**
     * Returns a list of type names the renderer can render.
     *
     * These names are used by the {@link RendererDispatcher} to dispatch
     * rendering calls to the correct renderer.
     */
    isAbleToRender(): string[];

    /**
     * Renders the object and returns it's string representation.
     */
    render(object: T): string;
}
