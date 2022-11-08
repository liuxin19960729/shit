import app from "../Shit";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends cc.Component {

    async start() {
        await app.init().catch(e => {
            this.onFailure(e);
        }).then(v => {
            this.onSucces();
        })
    }


    onSucces() {
        cc.director.loadScene("Main");
    }


    onFailure(e: Error) {
        console.log(e);
    }

}
