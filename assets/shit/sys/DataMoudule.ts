import config from "../../scripts/config";
import Module from "../Module";


declare global {
    namespace shit {
        interface IMods {
            data: IDataMoudule;
        }
    }
    interface IDataMoudule extends shit.IMod {
        getData(): tb.teamplates;
    }
    interface IDatas<T extends DataType> {
        findById(id: number): T

        findOne(predicate: (value: T, index: number, array: T[]) => boolean, thisArg?: any): T;
        has(id: number): boolean;
        find(predicate: (value: T, index: number, array: T[]) => boolean, thisArg?: any): T[];

        all(): T[];
    }
}
const { ccclass, property } = cc._decorator;

@ccclass
export default class DataMoudule extends Module implements IDataMoudule {
    private _datas: { [key: string]: Datas<any> } = {};
    onInit(): Promise<any> {
        return Promise.all([this._resources(), this._bundle()]);
    }

    private _resources(): Promise<any> {
        const self = this;
        return new Promise((res, rej) => {
            cc.resources.loadDir<cc.JsonAsset>(config.DATA_RESOUCRES_PATH, (e, data) => {
                if (!!e) {
                    rej(e);
                } else {
                    data.forEach(assert => {
                        self._parseJson(assert);
                    })
                    res(null);
                }

            });
        });
    }
    private _bundle(): Promise<any> {
        const self = this;
        return new Promise((res, rej) => {
            cc.assetManager.loadBundle(config.DATA_BUNDLE_PATH, (e, bundle) => {
                if (!!e) rej(e);
                bundle.loadDir<cc.JsonAsset>("./", (e, data) => {
                    if (!!e) {
                        rej(e);
                    } else {
                        data.forEach(assert => {
                            self._parseJson(assert);
                        })
                        res(null);
                    }

                })
            })
        });
    }
    private _parseJson(assert: cc.JsonAsset) {
        this._datas[assert.name] = new Datas(assert.json);
    }

    getData(): tb.teamplates {
        return <any>this._datas;
    }
}
type DataType = {
    readonly id: number;
}

class Datas<T extends DataType> implements IDatas<T>{
    private _array: T[] = null;
    private _map: { [key: number]: T } = null;
    constructor(data: T[]) {
        this._array = data || [];
        this._map = {};
        this._array.forEach(v => {
            this._map[v.id] = v;
        })
    }

    findById(id: number): T {
        return this._map[id];
    }

    findOne(predicate: (value: T, index: number, array: T[]) => boolean, thisArg?: any): T {
        let index = this._array.findIndex(predicate, thisArg);
        return index == -1 ? undefined : this._array[index];
    }

    has(id: number): boolean {
        return !!this._map[id];
    }
    find(predicate: (value: T, index: number, array: T[]) => boolean, thisArg?: any): T[] {
        return this._array.filter(predicate, thisArg) || [];
    }

    all(): T[] {
        return this._array.slice();
    }

}
