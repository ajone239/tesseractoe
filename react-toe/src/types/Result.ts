class Result<T, E extends Error> {
    private ok: T | null;
    private err: E | null;

    constructor(ok: T | null, err: E | null) {
        this.ok = ok;
        this.err = err;
    }

    unwrap(): T;

    expect(msg: string): T;

    isOk(): this is Result<T, never>;

    isErr(): this is Result<never, E>;

    getErr(): this extends Result<never, E> ? E : E | null;
}
