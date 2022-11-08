import Module from "../Module";

declare global {
    namespace shit {
        interface IMods {
            stroage: IStroageModule;
        }
    }
    interface IStroageModule extends shit.IMod {

    }



}
const { ccclass, property } = cc._decorator;

@ccclass
export default class StroageModule extends Module implements IStroageModule {

}
