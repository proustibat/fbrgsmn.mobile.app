import { Injectable } from '@angular/core';
import { GlobalService } from './global-service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class InitService {

    constructor ( public http: HttpClient, private vars: GlobalService ) {}

    public getInitData () {
        console.log( 'InitService.getInitData' );

        if ( this.vars.DEVMODE ) {
            return this.getFile( this.vars.URL_INFO_DEV );
        }

        return new Promise( ( resolve, reject ) => {
            return this.getFile( this.vars.URL_INFO_PROD )
                .then( data => resolve( data ) )
                .catch( error => {
                    return this.getFile( this.vars.URL_INFO_DEV )
                        .then( data => resolve( {
                            content: data,
                            error: `Error when loading ${this.vars.URL_INFO_PROD}: ${error}`
                        } ) )
                        .catch( err => reject( [ error.message, err.message ] ) );
                } );
        } );
    }

    private getFile ( url ) {
        console.log( 'getFile', url );
        return new Promise( ( resolve, reject ) => {
            this.http.get( url ).subscribe( data => resolve( data ), ( error ) => reject( error ) );
        } );
    }
}
