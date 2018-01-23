import { Loading, LoadingController, Toast, ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { GlobalService } from './global-service';

@Injectable()
export class PromptService {

    private loader: Loading;
    private messageToast: Toast;

    constructor( private loadingCtrl: LoadingController,
                 private vars: GlobalService,
                 private toastCtrl: ToastController ) {
        console.log( 'Hello PromptService Provider' );
    }

    public presentLoading( forRadio = false ) {
        const message = forRadio ? this.vars.getRandomMessageRadio() : this.vars.getRandomMessagePosts();
        this.loader = this.loadingCtrl.create( {
            content: message,
            spinner: 'dots'
        } );
        this.loader.present().catch( reason => console.log( `Error when presenting loader: ${ reason }` ) );
    }

    public dismissLoading() {
        if ( this.loader ) {
            this.loader.dismiss().catch( reason => console.log( `Error when dismissing loader: ${reason}` ) );
        }
    }

    public presentMessage( { message,
                               classNameCss,
                               duration,
                               callback
    }: { message: string,
        classNameCss?: string,
        duration?: number,
        callback?: () => void } ) {

        if ( this.messageToast ) {
            this.messageToast
                .dismiss()
                .catch( reason => console.log( `Error when dismissing toast: ${ reason }` ) );
        }

        this.messageToast = this.toastCtrl.create( {
            closeButtonText: 'x',
            cssClass: classNameCss || '',
            dismissOnPageChange: true,
            duration: duration || 5000,
            message,
            position: 'bottom',
            showCloseButton: true
        } );

        this.messageToast.onDidDismiss( () => {
            console.log( 'Dismissed toast' );
            if ( callback ) {
                callback();
            }
        } );

        this.messageToast
            .present()
            .catch( reason => console.log( `Error when presenting toast: ${ reason })` ) );
    }
}
