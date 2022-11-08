export default class HttpNet {
    private _xhr: XMLHttpRequest = null;
    constructor() {
        this._xhr = new XMLHttpRequest();
    }

    Get(url: string): Promise<XMLHttpRequest> {
        return new Promise((res, rej) => {
            this._xhr.onreadystatechange = function () {
                if (this.readyState == XMLHttpRequest.DONE) {
                    res(this);
                }
            };
            this._xhr.onerror = function () {
                rej("client error")
            }
            this._xhr.open("GET", url, true);
            this._xhr.send();
        });
    }
}