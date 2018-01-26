import { browser } from 'protractor';
// import { browser, element, by, ElementFinder } from 'protractor';

export class Page {

    navigateTo( destination ) {
        browser.waitForAngularEnabled( false );
        return browser.get( destination );
    }

    getTitle() {
        return browser.getTitle();
    }

}
