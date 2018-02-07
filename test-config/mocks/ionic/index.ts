import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {NavOptions} from "ionic-angular/navigation/nav-util";

export class StatusBarMock extends StatusBar {
    styleDefault() {
        return;
    }
}

export class SplashScreenMock extends SplashScreen {
    hide() {
        return;
    }
}

export class NavMock {

    public pop(): any {
        return new Promise(function(resolve: Function): void {
            resolve();
        });
    }

    public push(): any {
        return new Promise(function(resolve: Function): void {
            resolve();
        });
    }

    public getActive(): any {
        return {
            'instance': {
                'model': 'something',
            },
        };
    }

    public setRoot(): any {
        return true;
    }

    public registerChildNav( nav: any ): void {
        return ;
    }

}

export class DeepLinkerMock {}

export class LoadingComponentMock {
    public present(): Promise<any> {
        return Promise.resolve ( {} );
    }

    public dismiss(): Promise<any> {
        return Promise.resolve ( {} );
    }

}
export class LoadingControllerMock {
    public component: LoadingComponentMock = new LoadingComponentMock();

    public create(): LoadingComponentMock {
        return this.component;
    }
}

export class MockToast {
    public present( navOptions: any = {} ): Promise<any> {
        return Promise.resolve ( {} );
    }
    public dismiss( data?: any, role?: string, navOptions?: NavOptions ): Promise<any> {
        return Promise.resolve ( {} );
    }

    public onDidDismiss( callback: () => void ): void {
        callback();
        return;
    }
}

export class MockToastCtrl {
    public instance: MockToast = new MockToast();
    public create ( options: any = {} ): MockToast {
        return this.instance;
    }
}
