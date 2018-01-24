import { Component, Input } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser';

@Component( {
    selector: 'player',
    templateUrl: 'player.html'
} )

export class PlayerComponent {

    @Input() private options: any;
    private browserPopup: InAppBrowserObject;

    constructor( private translateService: TranslateService, private iab: InAppBrowser ) {
        console.log( 'Hello PlayerComponent' );
    }

    protected ngOnInit() {
        console.log( this.options );
    }

    private postToFeed () {
        // Escape HTML
        const el: HTMLElement = document.createElement( 'textarea' );
        el.innerHTML = this.options.currentSong.cover.jpg.toString();

        this.translateService
            .get( 'SHARING.CURRENT_SONG.FACEBOOK_FEED_DESCRIPTION',
                { track: this.options.currentSong.track, artist: this.options.currentSong.artist } )
            .subscribe( ( result: string ) => {
                const baseUrl = 'https://www.facebook.com/dialog/feed';
                const url = `${baseUrl}?app_id=419281238161744&name=${this.options.currentSong.title}
                &display=popup&caption=http://faubourgsimone.paris/application-mobile
                &description=${result}
                &link=faubourgsimone.paris/application-mobile
                &picture=${el.innerHTML}`;
                this.browserPopup = this.iab.create( url, '_blank' );
                // This check is because of a crash when simulated on desktop browser
                if ( typeof this.browserPopup.on( 'loadstop' ).subscribe === 'function' ) {
                    this.browserPopup.on( 'loadstop' ).subscribe( ( evt ) => {
                        if ( evt.url === 'https://www.facebook.com/dialog/return/close?#_=_' ) {
                            this.closePopUp();
                        }
                    } );
                }
            } );
    }

    private closePopUp () {
        this.browserPopup.close();
    }

}
