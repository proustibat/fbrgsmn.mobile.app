import { Loading, LoadingController, Toast, ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { GlobalService } from '../global-service/global-service';

@Injectable()
export class PromptService {

    private loader: Loading;
    private messageToast: Toast;

    constructor ( private loadingCtrl: LoadingController,
                 private toastCtrl: ToastController ) {
    }

    public presentLoading ( forRadio = false ) {
        const message = GlobalService.getRandomMessageIn(
            forRadio ? GlobalService.loadingMsgRadio : GlobalService.loadingMsgPosts
        );
        this.loader = this.loadingCtrl.create( {
            content: message,
            spinner: 'dots'
        } );
        this.loader.present().catch( this.onError );
    }

    public dismissLoading () {
        if ( this.loader ) {
            this.loader.dismiss().catch( this.onError );
        }
    }

    public presentMessage ( { message,
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
                .catch( this.onError );
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
            .catch( this.onError );
    }

    private onError( reason ) {
        console.log( `[PromptService] Error: ${ reason }` );
    }
}
