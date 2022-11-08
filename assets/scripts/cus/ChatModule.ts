
import Module from "../../shit/Module";
import WsNet, { WsNetEvent } from "../../shit/net/WsNet";
import config from "../config";

declare global {
    namespace shit {
        interface IMods {
            chat: IStroageModule;
        }
    }
    interface IStroageModule extends shit.IMod {

    }



}
const { ccclass, property } = cc._decorator;

@ccclass
export default class ChatModule extends Module implements IStroageModule {
    private _wsNet: WsNet = null;
    private _resolve: (v: any) => void = null;
    private _reject: (e: Error) => void = null;
    // onInit(): Promise<any> {
    //     const self = this;
    //     return new Promise((res, rej) => {
    //         self._resolve = res;
    //         self._reject = this._reject;
    //         self._wsNet = new WsNet(config.CHAT_URL, this._onEvent, this);
    //     })
    // }

    private _onEvent(event: WsNetEvent) {
        if (event.isWsError()) {
            if (!!this._reject) {
                this._reject(new Error("chat websocket error"));
                this._reject = null;
                this._reject = null;
            }
            console.error("ws error");
        } else if (event.isClose()) {
            console.error("ws close");
        } else if (event.isConnet()) {
            console.log("ws connect");
            if (!!this._resolve) {
                this._resolve("chat websocket success");
                this._reject = null;
                this._reject = null;
            }
        } else if (event.isRcvMsg()) {
            console.log("rcv msg");
        } else if (event.isSendCallError()) {
            console.log("rcv  call error");
        }
    }

    onUpdate(dt: number, totalTimes: any) {

    }
}
