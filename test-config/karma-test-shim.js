Error.stackTraceLimit = Infinity;

// ES6
import 'core-js/es6';
// import 'core-js/es6/date';
// import 'core-js/es6/function';
// import 'core-js/es6/number';
// import 'core-js/es6/parse-float';
// import 'core-js/es6/regexp';
// import 'core-js/es6/typed';
// reflect-metadata
import 'core-js/es7/reflect';

import 'core-js/fn/array/join';

// zone.js
import 'zone.js/dist/zone';
import 'zone.js/dist/proxy';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/async-test';
import 'zone.js/dist/jasmine-patch';

/**
 * Includes:
 * - zone.js
 * - ES7 reflection,
 * - ES6 polyfills, except for:
 * new regexp features, math features, symbols, typed arrays, weak maps / weak sets
 */
// import 'ionic-angular/polyfills/polyfills';

// TestBed initialization
import { TestBed } from '@angular/core/testing';
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
TestBed.initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
);

// load all specs in ./src
var appContext = require.context( '../src', true, /\.spec\.ts/ );
appContext.keys().map( appContext );

