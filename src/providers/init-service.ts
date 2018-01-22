import { Injectable } from '@angular/core';
// TODO : update
import { Http } from '@angular/http';
import { GlobalService } from './global-service';

@Injectable()
export class InitService {

  constructor( public http: Http, private vars: GlobalService ) {}

  public getInitData() {
    console.log( 'InitService.getInitData' );

    const localConfig = {
      local: true,
      loop_interval: 3000,
      streaming_url: 'http://91.121.65.131:8000/;'
    };

    if ( this.vars.DEVMODE ) {
      return new Promise( ( resolve ) => resolve( localConfig ) );
    } else {
      return new Promise( ( resolve, reject ) => {
        this.http.get( this.vars.URL_INFO_PROD )
            .map( ( res ) => res.json() )
            .subscribe( ( data ) => resolve( data ), ( error ) => {
              resolve( { content: localConfig, error: `Error when loading ${this.vars.URL_INFO_PROD}: ${error}` } );
            } );
      } );
    }
  }
}
