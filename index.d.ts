declare module 'coders.sqlite' {
    export default class CodersDB {
        constructor(dbPath?: string);

        name: string;
        version: string;

        get(key: string): Promise<any>;
        fetch(key: string): Promise<any>;

        set(key: string, data: any): Promise<any>;

        add(key: string, amount: number): Promise<number>;
        subtract(key: string, amount: number): Promise<number>;
        remove(key: string, amount: number): Promise<number>;
        math(key: string, amount: number, operator: '+' | '-' | '*' | '/' | '%'): Promise<number>;

        push(key: string, element: any): Promise<any[]>;
        pull(key: string, element: any): Promise<any[]>;

        delete(key: string): Promise<boolean>;
        del(key: string): Promise<boolean>;
        deleteAll(): Promise<boolean>;
        clear(): Promise<boolean>;

        has(key: string): Promise<boolean>;
        exists(key: string): Promise<boolean>;
        includes(key: string): Promise<boolean>;

        all(): Promise<Array<{ ID: string; data: any }>>;
        getAll(): Promise<Array<{ ID: string; data: any }>>;
        fetchAll(): Promise<Array<{ ID: string; data: any }>>;

        type(key: string): Promise<string>;
        typeof(key: string): Promise<string>;

        size(): Promise<number>;
        count(): Promise<number>;
        length(): Promise<number>;

        filter(filterFn: (item: { ID: string; data: any }) => boolean): Promise<Array<{ ID: string; data: any }>>;
        startsWith(prefix: string): Promise<Array<{ ID: string; data: any }>>;
        endsWith(suffix: string): Promise<Array<{ ID: string; data: any }>>;

        toJson(): Promise<Record<string, any>>;
        last(): Promise<{ ID: string; data: any } | undefined>;

        backup(filename?: string): Promise<{
            success: boolean;
            filename?: string;
            timestamp?: number;
            size?: number;
            error?: string;
        }>;

        close(): Promise<void>;
    }
}
