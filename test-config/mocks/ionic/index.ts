import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

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
