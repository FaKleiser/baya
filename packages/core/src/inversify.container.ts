import {Container, ContainerModule} from 'inversify';
import {provide, buildProviderModule} from 'inversify-binding-decorators';
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
 * Hook into the assemblyline workflow.
 */
const providePreRenderHook: () => any = () => {
    return provide(TYPES.PreRenderHook);
};

const DecoratorModule: ContainerModule = buildProviderModule();

export {
    container,
    provideTransformer,
    providePageRenderer,
    providePreRenderHook,
    DecoratorModule
};
