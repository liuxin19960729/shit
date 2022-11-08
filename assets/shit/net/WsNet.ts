enum E_WsNet_Status {
    None = 0,
    Close,
    Connect,
    RevMsg,
    WsError,
    SendCallError,
}

export class WsNetEvent {
    private _status: number = E_WsNet_Status.None;
    readonly data: ArrayBuffer = null;
    readonly event: Event = null;
    constructor(status: number, other?: any) {
        this._status = status;
        if (this._status == E_WsNet_Status.RevMsg) {
            this.data = other;
        } else if (this._status == E_WsNet_Status.WsError) {
            this.event = other;
        }
    }

    isClose() {
        return this._status == E_WsNet_Status.Close;
    }

    isRcvMsg() {
        return this._status == E_WsNet_Status.RevMsg;
    }

    isWsError() {
        return this._status == E_WsNet_Status.WsError;
    }



    isSendCallError() {
        return this._status == E_WsNet_Status.SendCallError;
    }

    isConnet() {
        return this._status == E_WsNet_Status.Connect;
    }

}

export default class WsNet {
    private _ws: WebSocket = null;
    private _onEvent: (event: WsNetEvent) => void = null;
    constructor(url: string, onEvent: (event: WsNetEvent) => void, thisArg?: any) {
        !!thisArg && onEvent.bind(thisArg);
        this._onEvent = onEvent;
        this._ws = new WebSocket(url);
        this._ws.binaryType = "arraybuffer";


        const self = this;
        this._ws.onclose = function () {
            self._onEvent(new WsNetEvent(E_WsNet_Status.Close));
        }
        this._ws.onerror = function (event) {
            self._onEvent(new WsNetEvent(E_WsNet_Status.WsError, event));
        }
        this._ws.onmessage = function (event: MessageEvent<ArrayBuffer>) {
            self._onEvent(new WsNetEvent(E_WsNet_Status.RevMsg, event.data));
        }
        this._ws.onopen = function () {
            self._onEvent(new WsNetEvent(E_WsNet_Status.Connect));
        }

    }


    isConnecting(): boolean {
        return this._ws.readyState == this._ws.CONNECTING;
    }

    send(data: ArrayBuffer) {
        if (this._ws.OPEN != this._ws.readyState) {
            this._onEvent(new WsNetEvent(E_WsNet_Status.WsError));
            return;
        }
        this._ws.send(data);
    }
    close() {
        this._ws.close();
    }
}
