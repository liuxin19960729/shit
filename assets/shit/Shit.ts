import Module, { ModType } from "./Module";

declare global {
    namespace shit {
        const sys: IMods;
        const cus: IMods;
        const isRunning: boolean;
        const totalTimes: number;
    }

}




const { ccclass, property } = cc._decorator;

@ccclass
export class Modules extends cc.Component {
    @property(cc.Node)
    sys: cc.Node = null;
    @property(cc.Node)
    cus: cc.Node = null;
    protected onLoad(): void {
        cc.game.addPersistRootNode(this.node);
        let syss = this.sys.getComponentsInChildren(Module) || [];
        let cuss = this.cus.getComponentsInChildren(Module) || [];
        syss.forEach(v => { app.register(v.node.name, v) });
        cuss.forEach(v => { app.register(v.node.name, v) });
    }


    protected onDestroy(): void {
        let syss = Object.values(app.sys).slice();
        let cuss = Object.values(app.sys).slice();
        syss.forEach(v => { app.unRegister((<any>v).name, v) });
        cuss.forEach(v => { app.unRegister((<any>v).name, v) });
    }
}


class App {
    readonly sys: { [key: string]: shit.IMod } = {};
    readonly cus: { [key: string]: shit.IMod } = {};
    private _ordSys: shit.IMod[] = [];
    private _ordCus: shit.IMod[] = [];
    private _isRunning: boolean = false;
    private _totalTimes: number = 0;
    get isRunning(): boolean {
        return this._isRunning;
    }
    get totalTimes(): number {
        return this._totalTimes;
    }
    register(name: string, mod: shit.IMod) {
        let mods;
        if (mod.type == ModType.Sys) {
            mods = this.sys;
        } else {
            mods = this.cus;
        }
        if (!!mods[name]) {
            throw Error(`${name} module 重复注册`);
        }
        mods[name] = mod;
        if (!!mod.onRegistered) mod.onRegistered();
        console.log(`${mod.type == ModType.Sys ? "sys" : "cus"} : ${name} module register`);
    }

    unRegister(name: string, mod: shit.IMod) {
        let mods;
        if (mod.type == ModType.Sys) {
            mods = this.sys;
        } else {
            mods = this.cus;
        }
        if (!!!mods[name]) {
            throw Error(`${name} module 未注册 Unregister失败`);
        }
        mods[name];
        delete mods[name];
        if (!!mod.onUnRegistered) mod.onUnRegistered();
        console.log(`${mod.type == ModType.Sys ? "sys" : "cus"} :  ${name} module unRegister`);
    }


    update(dt: number) {
        if (!this._isRunning) return;
        this._totalTimes += dt;
        this._ordSys.forEach(v => {
            if (!!v.onLateUpdate) {
                v.onLateUpdate(dt, this._totalTimes);
            }
        })

        this._ordCus.forEach(v => {
            if (!!v.onLateUpdate) {
                v.onLateUpdate(dt, this._totalTimes);
            }
        })
    }
    lateUpdate(dt: number) {
        if (!this._isRunning) return;
        this._ordSys.forEach(v => {
            if (!!v.onLateUpdate) {
                v.onLateUpdate(dt, this._totalTimes);
            }
        })

        this._ordCus.forEach(v => {
            if (!!v.onLateUpdate) {
                v.onLateUpdate(dt, this._totalTimes);
            }
        })


    }

    async init(): Promise<any> {
        this._ordSys = Object.values(this.sys).sort((a, b) => a.order - b.order) || [];
        this._ordCus = Object.values(this.cus).sort((a, b) => a.order - b.order) || [];
        let initafters = Object.values(this._ordSys).filter(v => !!v.onInitBefore);
        initafters.forEach(v => v.onInitBefore());
        initafters = Object.values(this._ordCus).filter(v => !!v.onInitBefore);
        initafters.forEach(v => v.onInitBefore());
        let inits = Object.values(this._ordSys).filter(v => !!v.onInit).map(v => v.onInit());
        let _e = null;
        await Promise.all(inits).catch(e => { _e = e });
        if (!!_e) return Promise.reject(_e);
        inits = Object.values(this._ordCus).filter(v => !!v.onInit).map(v => v.onInit());
        await Promise.all(inits)
        if (!!_e) return Promise.reject(_e);
        initafters = Object.values(this._ordSys).filter(v => !!v.onInitAfter);
        initafters.forEach(v => v.onInitAfter());
        initafters = Object.values(this._ordCus).filter(v => !!v.onInitAfter);
        initafters.forEach(v => v.onInitAfter());
        return Promise.resolve();
    }

    startGame() {
        this._isRunning = true;
        this._ordSys.forEach(v => {
            if (!!v.onStartGame) v.onStartGame();
        })
        this._ordCus.forEach(v => {
            if (!!v.onStartGame) v.onStartGame();
        })
    }

    pauseGame() {
        this._isRunning = false;
        this._ordSys.forEach(v => {
            if (!!v.onPauseGame) v.onPauseGame();
        })
        this._ordCus.forEach(v => {
            if (!!v.onPauseGame) v.onPauseGame();
        })
    }
}

const app = new App();
export default app;

(<any>window)["shit"] = app;
