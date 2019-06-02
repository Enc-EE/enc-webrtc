export declare class EEventT<T> {
    private listeners;
    addEventListener: (listener: (arg: T) => void) => void;
    dispatchEvent: (arg: T) => void;
    removeEventListener: (listener: (arg: T) => void) => void;
}
