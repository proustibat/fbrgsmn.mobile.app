import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/* tslint:disable:no-import-side-effect */
import 'rxjs/add/operator/map';
/* tslint:enable:no-import-side-effect */
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { TranslateService } from 'ng2-translate';

@Injectable()
export class TrackerService {

    constructor( public http: HttpClient,
                private ga: GoogleAnalytics,
                private translateService: TranslateService ) {
        console.log( 'Hello TrackerService Provider' );
    }

    public trackEventWithI18n( category: { translate: string, params?: any },
                               action: { translate: string, params?: any},
                               label: { translate: string, params?: any} ) {
        const params = {
            ...category.params,
            ...action.params,
            ...label.params
        };
        this.translateService
            .get( [
                category.translate,
                action.translate,
                label.params
            ], {
                ...category.params,
                ...action.params,
                ...label.params
            } )
            .subscribe( ( result: string ) => {
                const trackingCategory = result[ category.translate ];
                const trackingAction = result[ action.translate ];
                const trackingLabel = result[ label.translate ];
                console.log( trackingCategory, trackingAction, trackingLabel );
                this.ga.trackEvent( trackingCategory, trackingAction, trackingLabel );
            }, error => console.log( error ) );
    }

    public trackEventWithData( category, label, action ) {
        console.log( 'TrackerService.trackEventWithData' );
        console.log( category, label, action );
        this.ga.trackEvent( category, label, action );
    }

}
