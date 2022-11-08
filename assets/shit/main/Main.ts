import app from "../Shit";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {
    protected onEnable(): void {
        app.startGame();
        this.onStartGame();
    }

    onStartGame() {
        shit.sys.data.getData().datas.all().forEach(v => {
            console.log(v);
            console.log((<Object>v).__$$uniqueId$$__)
        })

    }

    protected update(dt: number): void {
        app.update(dt);
    }

    protected lateUpdate(dt: number): void {
        app.lateUpdate(dt);
    }
    protected onDisable(): void {
        app.pauseGame();
    }
}
