import { ClrLoadingState } from './loading';
/**
 * This is an abstract class because we need it to still be a valid token for dependency injection after transpiling.
 * This does not mean you should extend it, simply implementing it is fine.
 */
export declare abstract class LoadingListener {
    abstract loadingStateChange(state: ClrLoadingState | string): void;
}
