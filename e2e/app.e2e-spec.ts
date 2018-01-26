import { Page } from './app.po';
import { browser, by, element } from 'protractor';

describe( 'App', () => {
    let page: Page;

    beforeEach( () => {
        page = new Page();
    } );

    describe( 'default screen', () => {
        beforeEach( () => {
            page.navigateTo( '/' );
        } );

        it( 'should have a title saying Ionic App', () => {
            page.getTitle().then( title => {
                expect( title ).toEqual( 'Ionic App' );
            } );
        } );

        it( 'displays the radio tab by default', () => {

            expect( element( by.css( '[aria-selected=true] .tab-button-text' ) ) // Grab the title of the selected tab
                .getAttribute( 'innerHTML' ) ) // Get the text content
                .toContain( 'Radio' ); // Check if it contains the text "Home"
        } );
    } );

} );
