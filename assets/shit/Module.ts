export enum ModType {
    Sys,
    Cus
}
declare global {
    namespace shit {

        interface IMod {
            type: ModType;
            order: number;
            onRegistered?();
            onUnRegistered?();

            onInitBefore?();
            onInit?(): Promise<any>;
            onInitAfter?();

            onStartGame?();
            onPauseGame?();

            onUpdate?(dt: number, totalTimes);
            onLateUpdate?(dt: number, totalTimes);
        }
        interface IMods {

        }
    }

}


const { ccclass, property } = cc._decorator;

@ccclass
export default class Module extends cc.Component implements shit.IMod {
    @property({ type: cc.Enum(ModType) })
    type: ModType = ModType.Cus;
    @property({ type: cc.Integer })
    order: number = 0;

}
