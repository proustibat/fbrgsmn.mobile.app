import { Component, Input } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { SocialSharing } from '@ionic-native/social-sharing';
import { PromptService } from '../../providers/prompt-service/prompt-service';
import { TrackerService } from '../../providers/tracker-service/tracker-service';
import { Screenshot } from '@ionic-native/screenshot';

@Component( {
    selector: 'share-button',
    templateUrl: 'share-button.html'
} )

export class ShareButtonComponent {

    @Input() private options: any;
    @Input() private trackingOptions: any;
    @Input() private hasLabel: boolean;
    @Input() private doScreenShot: boolean;
    @Input() private content: boolean;

    constructor ( private ga: GoogleAnalytics,
                private socialSharing: SocialSharing,
                private prompt: PromptService,
                private tracker: TrackerService,
                private screenshot: Screenshot ) {
    }

    private onClick () {
        if ( this.doScreenShot ) {
            this.screenshot.URI( 100 ).then(
                result => { this.onScreenshotComplete( result ); },
                error => { this.onScreenshotError( error ); }
            );
        } else {
            this.shareIt( this.options );
        }
    }

    private onScreenshotComplete ( result ) {
        this.options.image = result.URI;
        this.shareIt( this.options );
    }
    private onScreenshotError ( error ) {
        console.log( 'Error: ', error );
        this.prompt.presentMessage( {
            classNameCss: 'error',
            message: `Une erreur s'est produite lors de la screenshot : \n ${ error.toString() }`
        } );
    }

    private shareIt ( options ) {
        this.socialSharing
            .share(
            options.message || null,
            options.subject || null,
            options.image || null,
            options.url || null
            )
            .then( () => {
                if ( this.trackingOptions ) {
                    this.tracker.trackEventWithData(
                        this.trackingOptions.category,
                        this.trackingOptions.action,
                        this.trackingOptions.label );
                }
            } )
            .catch( e => {
                if ( this.trackingOptions ) {
                    // TODO translate
                    const lbl = 'Une erreur s\'est produite pour partager';
                    const msg = `${ lbl } ${ this.trackingOptions.label }: \n ${ e.toString() }`;
                    this.prompt.presentMessage( {
                        classNameCss: 'error',
                        message: msg
                    } );
                }
            } );
    }
}
