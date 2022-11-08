type RawKeyType = number | string | symbol;
type KVMapWarpType<V> = {
    [key: RawKeyType]: V;
}

class Node<K, V>{
    key: K;
    value: V;
    constructor(key: K, value: V) {
        this.key = key;
        this.value = value;
    }
}
export class KVMap<K, V> {
    protected _map: KVMapWarpType<Node<K, V>> | V[] = null;
    private _size: number = 0;
    constructor(data?: V[]) {
        this._map = !!data ? data : {};
    }
    get size(): number {
        return this._size;
    }

    clear() {
        this._size = 0;
        this._map = {};
    }
    delete(key: K): boolean {
        let v = this.get(key);
        if (!!v) {
            delete this._map[this._gerRawKey(key)];
        }
        return !!v;
    }

    forEach(callbackfn: (value: V, key: K, map: KVMap<K, V>) => void, thisArg?: any) {
        let ks = Object.keys(this._map).slice();
        !!thisArg && callbackfn.bind(thisArg);
        ks.forEach(k => {
            let kk;
            let vv;
            if (Array.isArray(this._map)) {
                kk = k;
                vv = this._map[k];
            } else {
                let v = this._map[k];
                kk = v.key;
                vv = v.value;
            }

            callbackfn(kk, vv, this);
        })
    }

    get(key: K): V | undefined {
        let v = this._map[this._gerRawKey(key)];
        return !!v ? v.value : undefined;
    }
    has(key: K): boolean {
        return !!this.get(key);
    }
    set(key: K, value: V): this {
        if (Array.isArray(this._map)) {
            this._map[<number>key] = value;
        } else {
            this._map[this._gerRawKey(key)] = new Node(key, value);
        }
        return this;
    }

    private _vs: V[] = null;
    values(): V[] {
        if (!!!this._vs) {
            if (Array.isArray(this._map)) {
                return this._map.slice();
            } else {
                this._vs = Object.values(this._map).map(v => v.value) || [];
            }
        }
        return this._vs.slice();
    }
    private _gerRawKey(key: K): RawKeyType {
        if (typeof key == "symbol" || typeof key == "string" || typeof key == "number") return key;
        return (<Object>key).__$$uniqueId$$__;
    }
}
