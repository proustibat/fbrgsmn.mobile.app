import { Component } from '@angular/core';
import { RadioPage } from '../radio/radio';

@Component( {
    templateUrl: 'tabs.html'
} )
export class TabsPage {

    public tab1Root = RadioPage;

}
