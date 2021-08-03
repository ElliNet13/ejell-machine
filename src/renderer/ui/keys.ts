import { readable, Readable, writable, Writable } from "svelte/store";

const downs: Record<string, ((key: string) => any)[]> = {};
const ups: Record<string, ((key: string) => any)[]> = {};

export const keys = {
    alt: false,
    ctrl: false,
    meta: false,
    shift: false,
};

export const keys$ = writable({
    alt: false,
    ctrl: false,
    meta: false,
    shift: false,
});

on("Alt").observe(keys, "alt").observe$(keys$, "alt");
on("Control").observe(keys, "ctrl").observe$(keys$, "ctrl");
on("Meta").observe(keys, "meta").observe$(keys$, "meta");
on("Shift").observe(keys, "shift").observe$(keys$, "shift");

export function on(key: string) {
    key = key.toLowerCase();
    return makeObject(key, []);
}

function makeObject(key: string, whens: ((key: string) => any)[]): KeyListener {
    return {
        when(fn: (key: string) => any) {
            return makeObject(key, [...whens, fn]);
        },

        down(down: (key: string) => any) {
            const newDown = (key: string) => whens.every(w => w(key)) && down(key);

            if (downs[key]) downs[key].push(newDown);
            else downs[key] = [newDown];
            return this;
        },

        up(up: (key: string) => any) {
            const newUp = (key: string) => whens.every(w => w(key)) && up(key);

            if (ups[key]) ups[key].push(newUp);
            else ups[key] = [newUp];
            return this;
        },

        observe(object?: any, key?: any) {
            if (object) {
                this.observe().subscribe((v: boolean) => object[key] = v);
                return this;
            }

            return readable(false as boolean, set => void this.down(() => set(true)).up(() => set(false)));
        },
        observe$(object: Writable<any>, key?: any) {
            this.observe().subscribe((v: boolean) => object.update(o => (o[key] = v, o)));
            return this;
        }
    }
}

export interface KeyListener {
    when(fn: (key: string) => any): KeyListener;

    down(down: (key: string) => any): this;
    up(up: (key: string) => any): this;

    observe<K extends string>(object: { [U in K]: boolean}, key: K): this;
    observe(): Readable<boolean>;
    observe$<K extends string>(object: Writable<{ [U in K]: boolean}>, key: K): this;
}

export function onkey(key: string, down: () => any, up?: () => any) {
    key = key.toLowerCase();
    if (downs[key]) downs[key].push(down);
    else downs[key] = [down];

    if (up) {
        if (ups[key]) ups[key].push(up);
        else ups[key] = [up];
    }
}

// export function observekey(key: string) {
//     return readable(false, set => onkey(key, () => set(true), () => set(false)));
// }

window.addEventListener("keydown", e => {
    downs[e.key.toLowerCase()]?.forEach(f => f(e.key));
});

window.addEventListener("keyup", e => {
    ups[e.key.toLowerCase()]?.forEach(f => f(e.key));
});
