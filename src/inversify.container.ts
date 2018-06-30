import {Container} from 'inversify';
import {provide} from 'inversify-binding-decorators';
import {TYPES} from './types';

const container: Container = new Container();

/**
 * Used to annotate and register {@link Transformer}s.
 */
const provideTransformer: () => any = () => {
    return provide(TYPES.Transformer);
};

/**
 * Used to annotate and register {@link PageRenderer}s.
 */
const providePageRenderer: () => any = () => {
    return provide(TYPES.PageRenderer);
};

/**
 * Used to annotate and register {@link ModuleRenderer}s.
 */
const provideModuleRenderer: () => any = () => {
    return provide(TYPES.ModuleRenderer);
};

/**
 * Hook into the assemblyline workflow.
 */
const providePreRenderHook: () => any = () => {
    return provide(TYPES.PreRenderHook);
};

export {
    container,
    provideTransformer,
    providePageRenderer,
    provideModuleRenderer,
    providePreRenderHook,
};
