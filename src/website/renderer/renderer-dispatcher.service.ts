import {Renderer} from './renderer.interface';
import {injectable} from 'inversify';

@injectable()
export class RendererDispatcher<T> implements Renderer<T> {

    private _renderers: Map<string, Renderer<any>> = new Map();

    constructor() {
    }

    public isAbleToRender(): string[] {
        return Array.from(this._renderers.keys());
    }

    public register<C extends T>(renderer: Renderer<C>): void {
        renderer.isAbleToRender().forEach((name) => {
            if (this._renderers.get(name)) {
                throw new Error(`Renderer for ${name} already set to ${this._renderers.get(name)}`);
            }
            this._renderers.set(name, renderer);
        });
    }

    render(object: T): string {
        const name: string = this.getName(object);
        if (object == undefined) {
            throw new Error('Object must not be undefined!');
        }
        if (this._renderers.get(name)) {
            return this._renderers.get(name).render(object);
        } else {
            throw new Error(`Renderer for ${name} not available. Available renderers: ${this.isAbleToRender().join(', ')}`);
        }
    }

    /**
     * Returns the name of the object, such that a registered renderer for the name
     * can be found.
     *
     * By default, uses the class name.
     */
    protected getName(object: T): string {
        return object.constructor.name;
    }
}
