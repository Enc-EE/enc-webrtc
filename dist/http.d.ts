export declare class Http {
    headers: {
        name: string;
        value: string;
    }[];
    get: (url: string) => Promise<string>;
    put: (url: string, data?: string | undefined) => Promise<string>;
    post: (url: string, data?: string | undefined) => Promise<string>;
    delete: (url: string) => Promise<string>;
    private request;
}
