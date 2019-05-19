export class EEventT<T> {
    private listeners: ((arg: T) => void)[] = [];

    public addEventListener = (listener: (arg: T) => void) => {
        // validation
        if (!listener || this.listeners.indexOf(listener) >= 0) {
            throw "listener already added";
        }

        this.listeners.push(listener);
    }

    public dispatchEvent = (arg: T) => {
        for (let i = 0; i < this.listeners.length; i++) {
            const event = this.listeners[i];
            event(arg);
        }
    }

    public removeEventListener = (listener: (arg: T) => void) => {
        // validation
        if (!listener || this.listeners.indexOf(listener) < 0) {
            throw "listener not found";
        }

        this.listeners.splice(this.listeners.indexOf(listener), 1);
    }
}