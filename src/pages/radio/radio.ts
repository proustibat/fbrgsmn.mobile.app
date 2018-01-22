import { Component } from '@angular/core';
import { NavController, Platform, ViewController } from 'ionic-angular';

import { GlobalService } from '../../providers/global-service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { InitService } from '../../providers/init-service';

/* tslint:disable:no-unused-variable */
declare let cordova: any;
declare let FB: any;
/* tslint:enable:no-unused-variable */

@Component( {
  selector: 'page-radio',
  templateUrl: 'radio.html'
} )
export class RadioPage {

  private currentSong = { cover: { jpg: '', svg: '' }, title: '', artist: '', track: '' };

  constructor( public navCtrl: NavController,
               private vars: GlobalService,
               public plt: Platform,
               private ga: GoogleAnalytics,
               public viewCtrl: ViewController,
               private initService: InitService,
  ) {
    this.currentSong = { cover: this.vars.COVER_DEFAULT, title: 'Title', artist: 'Artist', track: 'Track' };
    console.log( this.currentSong );

    this.plt.ready().then( ( readySource ) => {
      console.log( 'Platform ready from', readySource );

        this.ga.trackView( this.viewCtrl.name );

        // Look for streaming address in a json file on a server
        this.initService.getInitData().then( ( data: any ) => {
            console.log( data );
        } );
    } );
  }
}
