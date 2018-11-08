import {ContainerModule, interfaces} from 'inversify';
import {Weaver} from './weaver';

export const WorkflowModule: ContainerModule = new ContainerModule((bind: interfaces.Bind) => {
    bind(Weaver).toSelf();
});
