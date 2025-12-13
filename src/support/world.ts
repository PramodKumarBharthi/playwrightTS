// Compatibility shim: re-export UIWorld as IWorld for existing step files
import { UIWorld } from './ui-fixtures';
import { ApiWorld } from './api-fixtures';

export type IWorld = UIWorld;
export { UIWorld, ApiWorld };
