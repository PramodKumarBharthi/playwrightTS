// Compatibility shim: re-export UIWorld as IWorld for existing step files
import { UIWorld } from './ui-fixtures';

export type IWorld = UIWorld;
export { UIWorld };
