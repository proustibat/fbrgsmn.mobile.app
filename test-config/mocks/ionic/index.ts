import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NavOptions } from 'ionic-angular/navigation/nav-util';
import { PromptService } from '../../../src/providers/prompt-service';
// import { Observable } from 'rxjs/Observable';
import { Observable  } from 'rxjs';
import { EventEmitter } from '@angular/core';

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

export class PromptServiceMock extends PromptService {
    public presentLoading() {
        return;
    }
    public dismissLoading() {
        return;
    }
    public presentMessage() {
        return;
    }
}

import { Media, MEDIA_ERROR, MEDIA_STATUS, MediaObject } from '@ionic-native/media';
import {Subscriber} from "rxjs/Subscriber";

export class MediaObjectMock  {
    // private _objectInstance;
    onSuccess: Observable<any>;
    onError: Observable<any>;
    onStatusUpdate: Observable<any>;
    // onStatusUpdate = new Observable<any>( ( subscriber: Subscriber<string> ) => subscriber.complete() );
    // onStatusUpdate: Observable<any> = Observable.create( observer => {
    //     // observer.onNext( 42 );
    //     observer.onCompleted();
    //
    //     // // Note that this is optional, you do not have to return this if you require no cleanup
    //     // return Rx.Disposable.create(function () {
    //     //     console.log('disposed');
    //     // });
    // } );

    // constructor(_objectInstance?: any, onSuccess?: Observable<any>, onError?: Observable<any>, onStatusUpdate?: Observable<any>) {
    //     super(_objectInstance);
    // };
    //
    // public onStatusUpdate(): Observable<any> {
    //     return Observable.create( observer => {
    //         observer.onNext( 42 );
    //         observer.onCompleted();
    //
    //         // // Note that this is optional, you do not have to return this if you require no cleanup
    //         // return Rx.Disposable.create(function () {
    //         //     console.log('disposed');
    //         // });
    //     } );
    // }
    /**
     * Get the current amplitude of the current recording.
     * @returns {Promise<any>} Returns a promise with the amplitude of the current recording
     */
    getCurrentAmplitude(): Promise<any> {
        return new Promise( resolve => {
            resolve();
        } );
    }
    /**
     * Get the current position within an audio file. Also updates the Media object's position parameter.
     * @returns {Promise<any>} Returns a promise with the position of the current recording
     */
    getCurrentPosition(): Promise<any> {
        return new Promise( resolve => {
            resolve();
        } );
    }
    /**
     * Get the duration of an audio file in seconds. If the duration is unknown, it returns a value of -1.
     * @returns {number} Returns a promise with the duration of the current recording
     */
    getDuration(): number {
        return 42;
    };
    /**
     * Starts or resumes playing an audio file.
     */
    play( iosOptions?: {
        numberOfLoops?: number;
        playAudioWhenScreenIsLocked?: boolean;
    } ): void { return; }
    /**
     * Pauses playing an audio file.
     */
    pause(): void { return; }
    /**
     * Releases the underlying operating system's audio resources. This is particularly important for Android, since there are a finite amount of OpenCore instances for media playback. Applications should call the release function for any Media resource that is no longer needed.
     */
    release(): void { return; }
    /**
     * Sets the current position within an audio file.
     * @param {number} milliseconds The time position you want to set for the current audio file
     */
    seekTo( milliseconds: number ): void { return; }
    /**
     * Set the volume for an audio file.
     * @param volume {number} The volume to set for playback. The value must be within the range of 0.0 to 1.0.
     */
    setVolume( volume: number ): void { return; }
    /**
     * Starts recording an audio file.
     */
    startRecord(): void { return; }
    /**
     * Stops recording
     */
    stopRecord(): void { return; }
    /**
     * Pauses recording
     */
    pauseRecord(): void { return; }
    /**
     * Resumes recording
     */
    resumeRecord(): void { return; }
    /**
     * Stops playing an audio file.
     */
    stop(): void { return; }
}
export declare type MediaStatusUpdateCallback = (statusCode: number) => void;
export interface MediaError {
    /**
     * Error message
     */
    message: string;
    /**
     * Error code
     */
    code: number;
}
export declare type MediaErrorCallback = (error: MediaError) => void;

export class MediaMock {
    /**
     * @hidden
     */
    MEDIA_NONE: number;
    /**
     * @hidden
     */
    MEDIA_STARTING: number;
    /**
     * @hidden
     */
    MEDIA_RUNNING: number;
    /**
     * @hidden
     */
    MEDIA_PAUSED: number;
    /**
     * @hidden
     */
    MEDIA_STOPPED: number;
    /**
     * @hidden
     */
    MEDIA_ERR_ABORTED: number;
    /**
     * @hidden
     */
    MEDIA_ERR_NETWORK: number;
    /**
     * @hidden
     */
    MEDIA_ERR_DECODE: number;
    /**
     * @hidden
     */
    MEDIA_ERR_NONE_SUPPORTED: number;
    /**
     * Open a media file
     * @param src {string} A URI containing the audio content.
     * @param [onStatusUpdate] {MediaStatusUpdateCallback} A callback function to be invoked when the status of the file changes
     * @param [onSuccess] {Function} A callback function to be invoked after the current play, record, or stop action is completed
     * @param [onError] {MediaErrorCallback} A callback function is be invoked if an error occurs.
     * @return {MediaObject}
     */
    create(src: string): MediaObjectMock {
        let response: MediaObjectMock;
        return response;
    };
}
