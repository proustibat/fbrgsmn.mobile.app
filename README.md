# Faubourg Simone: mobile app [![GitHub license](https://img.shields.io/github/license/proustibat/fbrgsmn.mobile.app.svg)](https://github.com/proustibat/fbrgsmn.mobile.app/blob/master/LICENSE) [![Twitter Follow](https://img.shields.io/twitter/follow/faubourgsimone.svg?style=social&label=Follow)](https://twitter.com/faubourgsimone)

Source code of [Faubourg Simone](http://faubourgsimone.paris/) mobile applications built with Ionic. 

------------

| <a href='https://play.google.com/store/apps/details?id=com.mfkr.faubourg.simone&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png' width="150"/></a> <br/> <a href='https://itunes.apple.com/fr/app/faubourg-simone-radio/id617687434&pcampaignid=GITHUB'><img alt='Get it on Apple Store' src='https://devimages-cdn.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg' width="132"/></a> | [![Build Status](https://travis-ci.org/proustibat/fbrgsmn.mobile.app.svg?branch=master)](https://travis-ci.org/proustibat/fbrgsmn.mobile.app) <br/> [![Sonar quality gate](https://sonarcloud.io/api/badges/gate?key=fbrgsmn.mobile.app)](https://sonarcloud.io/dashboard?id=fbrgsmn.mobile.app) </br> [![Code Climate](https://codeclimate.com/github/proustibat/fbrgsmn.mobile.app/badges/gpa.svg)](https://codeclimate.com/github/proustibat/fbrgsmn.mobile.app) </br> [![Sonar Coverage](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=coverage)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=coverage) | [![Maintenance](https://img.shields.io/maintenance/yes/2018.svg)](https://github.com/proustibat/fbrgsmn.mobile.app/commits/master) <br/> [![GitHub last commit](https://img.shields.io/github/last-commit/proustibat/fbrgsmn.mobile.app.svg)](https://github.com/proustibat/fbrgsmn.mobile.app/commits/master) <br/> [![Open issues](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=open_issues)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=open_issues) | [![Greenkeeper badge](https://badges.greenkeeper.io/proustibat/fbrgsmn.mobile.app.svg)](https://greenkeeper.io/) <br/> [![Dependencies Status](https://david-dm.org/proustibat/fbrgsmn.mobile.app/status.svg)](https://david-dm.org/proustibat/fbrgsmn.mobile.app) <br/> [![DevDependencies Status](https://david-dm.org/proustibat/fbrgsmn.mobile.app/dev-status.svg)](https://david-dm.org/proustibat/fbrgsmn.mobile.app?type=dev) |
| --- | :---- | :---- | :---- 


----------------

# Features
- Listening to our radio
- See content of our website: Pola / Calepins / Dans le casque

----------------

# For Developers


## Prerequisites
Be sure [Ionic](https://ionicframework.com/) and [Cordova](https://cordova.apache.org/) are installed:

```bash
cordova -v
ionic -v
```

If it's not the case, run `npm install -g ionic cordova`.

You also needs sdks:
- For Android development we recommand to install [Android Studio](https://developer.android.com/studio/index.html). 
- For IOS you don't have the choice: you need [XCode](https://developer.apple.com/xcode/)

Run `ionic info` to be sure your system is ok.

Our current configuration is the following:
```
cli packages:
    @ionic/cli-utils  : 1.19.1
    ionic (Ionic CLI) : 3.19.1
    
global packages:
    cordova (Cordova CLI) : 8.0.0 
    
local packages:
    @ionic/app-scripts : 3.1.8
    Cordova Platforms  : android 7.0.0 ios 4.5.4
    Ionic Framework    : ionic-angular 3.9.2
```


## Installation

```bash
git clone git@github.com:proustibat/fbrgsmn.mobile.app.git
cd fbrgsmn.mobile.app
ionic cordova prepare
```

Answer `Y` to the following question to run `npm install` automatically:
```bash
? Looks like a fresh checkout! No ./node_modules directory found. Would you like to install project dependencies? (Y/n) 
```

## Watching

### In a browser
```bash
ionic serve -l
```

### On a device
```bash
ionic cordova run android -l -c -s
```

### On a simulator

```bash
ionic cordova emulate ios --target="iPhone-8"
```
## Code documentation is [available here](https://proustibat.github.io/fbrgsmn.mobile.app/)

## Building
```bash
ionic cordova build ios android
```

## Testing
Config files are in 'test-config' folder. Mocks file are in 'test-config/mocks', if you need to add some, please add it here.

### Unit testing
```bash
npm run test
```
It starts [Karma](https://karma-runner.github.io/2.0/index.html) to watch tests and work on them. 
Each file of the sources matches a test file with '.spec.ts' extension. We choose the [Jasmine](https://jasmine.github.io/) framework (v2.8), so if you're not familiar, please read the [documentation](https://jasmine.github.io/api/2.8/global)

### E2E Testing
```bash
npm run e2e
```
It runs [Protractor](). Protractor is a Node.js program, and runs end-to-end tests that are also written in JavaScript and run with node. Protractor uses WebDriver to control browsers and simulate user actions.
*Note that you need to run* `ionic serve -l` **before** *running e2e tests*

### Tests linting
By default, tests are removed from `tslint` and `tslint:codeclimate` scripts because of incompatible rules. 
They should be checked with `npm run tslint:tests`


## Contributing
- Issue Tracker: [https://github.com/proustibat/fbrgsmn.mobile.app/issues](https://github.com/proustibat/fbrgsmn.mobile.app/issues)
- Source Code: [https://github.com/proustibat/fbrgsmn.mobile.app](https://github.com/proustibat/fbrgsmn.mobile.app)


## Recommandations

### Use Gitflow Worklow
We use [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow).
Please follow this branching model.
Once your branch is pushed (hotfix or feature), make a pull request [here](https://github.com/proustibat/fbrgsmn.mobile.app/pulls).
Travis will check if tests are passed and we'll accept your PR depending on results.

### Check your contribution before submitting it
#### Linting
Be sure your code is alright: run `npm run all-custom-lint` and `npm run lint`. 
Also run `npm run test-ci` to be sure your work will be accepted on our [Travis CI](https://travis-ci.org/proustibat/fbrgsmn.mobile.app) process.

**Config files are in source code:** 
- tslint.json ( and tslint-tests.json, tslint-tests.json, tslint-codeclimate.json)
- tsconfig.json ( contains typedoc options )
- .stylelintrc
- .scss-lint.yml
- .editorconfig
- .codeclimate.yml

Don't hesitate to create an issue if you wanna change its and discuss about theses changes.

If you wanna be perfect :-) install [CodeClimate](https://github.com/codeclimate/codeclimate#installation) and use `npm run codeclimate:analyze` to see what will displayed on our [CodeClimate Dashboard](https://codeclimate.com/github/proustibat/fbrgsmn.mobile.app) 

#### Tests and Coverage
Please run or add unit tests and e2e tests if needed. Make sure it covers the right parts. You can use `npm run test-coverage` to see the code coverage. It will create a coverage folder, the same that is automatically published [here](https://proustibat.github.io/fbrgsmn.mobile.app/coverage/) 

### Update the documentation
If you update the code documentation or add commented code, you could check your changes by running `npm run typedoc`, it will create a 'documentation' folder. This will be published automatically on the [public documentation](https://proustibat.github.io/fbrgsmn.mobile.app/)


## Support
If you are having issues, please let us know: tech.team@faubourgsimone.com

## License
The project is licensed under the [GNU Affero General Public License v3.0 license](LICENSE)

--------------------

## Tools Summary

### Travis CI
Triggered at each push action on the repo (on any branches).
You could see our dashboard [here](https://travis-ci.org/proustibat/fbrgsmn.mobile.app)
Used to run tests, linting, generate code coverage results and code documentation. 
Then it publishes it on our [public results](https://proustibat.github.io/fbrgsmn.mobile.app/).

### CodeClimate
[Our dashboard](https://codeclimate.com/github/proustibat/fbrgsmn.mobile.app) is updated at each push.

### Sonarqube
We use **[Sonarqube](https://www.sonarqube.org/)** on [Sonarcloud.io](https://about.sonarcloud.io/get-started/) to keep our code safe. Scans are applied after each push on the repo.

Our dashboard is available here: [https://sonarcloud.io/dashboard?id=fbrgsmn.mobile.app](https://sonarcloud.io/dashboard?id=fbrgsmn.mobile.app)

We also have a dashboard for the develop branch, see it here: [https://sonarcloud.io/dashboard?id=fbrgsmn.mobile.app%3Adevelop](https://sonarcloud.io/dashboard?id=fbrgsmn.mobile.app%3Adevelop)

### Greenkeeper
It's a real-time monitoring and automatic updates for npm dependencies. If an update is available on our dependencies, it updates it on a specific branch and creates a pull request. Travis will then be triggered, if tests are passed we can accept the pull request.
Learn more about it [here](https://greenkeeper.io/)

### Typedoc
A documentation generator for TypeScript projects: our results are [here](https://proustibat.github.io/fbrgsmn.mobile.app/documentation/)
Learn more about it [here](http://typedoc.org/)

### Commitizen
If you wanna contribute to the project and create a pull request, use it by running `git cz` instead of `git commit`.
Learn more about it [here](https://github.com/commitizen/cz-cli)

--------------------

## A glance at our actual Sonarqube metrics

#### Complexity
How simple or complicated the control flow of the application is. 

[![Complexity](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=complexity)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=complexity) 
[![Complexity per file](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=file_complexity)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=file_complexity)
[![Cognitive Complexity](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=cognitive_complexity)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=cognitive_complexity)


Cyclomatic Complexity measures the minimum number of test cases requiref for full test coverage. 
Cognitive Complexity is a measure of how difficult the application is to understand

*Complexity for Javascript or typescript is incremented by one for each:*
- *function (i.e non-abstract and non-anonymous constructors, functions, procedures or methods)*
- *if statement*
- *short-circuit (AKA lazy) logical conjunction (&&)*
- *short-circuit (AKA lazy) logical disjunction (||)*
- *ternary conditional expressions*
- *loop*
- *case clauses of a switch statement*
- *throw and catch statement*
- *return statement (except when it is the very last statement of a function)*

*Complexity of the web page is measured by counting the decision tags (such as if and forEach) and boolean operators in expressions (&& and ||), plus one for the body of the document. 
The decision tags and the operators are configurable through the Complexity rule.*


#### Documentation & sizes

[![Lines](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=lines)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=lines) 
[![Lines of code](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=ncloc)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=ncloc) 
[![Comment lines](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=comment_lines)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=comment_lines) 
[![Comments (%)](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=comment_lines_density)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=comment_lines_density)

[![Directories](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=directories)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=directories) 
[![Files](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=files)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=files)
[![Classes](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=classes)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=classes) 
[![Functions](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=functions)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=functions)


#### Duplications

[![Duplicated blocks](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=duplicated_blocks)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=duplicated_blocks) 
[![Duplicated lines](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=duplicated_lines)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=duplicated_lines)


#### Issues

[![Open issues](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=open_issues)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=open_issues)
[![Confirmed issues](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=confirmed_issues)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=confirmed_issues)
[![Won't fix issues](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=wont_fix_issues)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=wont_fix_issues) 


#### Maintainability

Issues in this domain mark code that will be more difficult to update competently than it should

[![Code smells](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=code_smells)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=code_smells)
[![SQALE Rating](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=sqale_rating)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=sqale_rating)

Rating given to the project related to the value of the Technical Debt Ratio. 
The default Maintainability Rating grid is:
- A=0-0.05, 
- B=0.06-0.1,
- C=0.11-0.20, 
- D=0.21-0.5, 
- E=0.51-1

The Maintainability rating scale can be alternately stated by saying that if the outstanding remediation cost is:
* <=5% of the time that has already gone into the application, the rating is A 
* between 6 to 10% the rating is a B 
* between 11 to 20% the rating is a C 
* between 21 to 50% the rating is a D
* anything over 50% is an E

#### Technical debt
Effort to fix all maintainability issues. The measure is stored in minutes. An 8-hour day is assumed when values are shown in days. (The value of the cost to develop a line of code is 0.06 days)

[![Technical debt](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=sqale_index)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=sqale_index) 
[![Technical debt ratio](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=sqale_debt_ratio)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=sqale_debt_ratio)


#### Reliability

Issues in this domain mark code where you will get behavior other than what was expected.

[![Bugs](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=bugs)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=bugs)
[![Reliability remediation effort](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=reliability_remediation_effort)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=reliability_remediation_effort)
[![Reliability Rating](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=reliability_rating)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=reliability_rating)

**Reliability remediation effort**

Effort to fix all bug issues. The measure is stored in minutes. An 8-hour day is assumed when values are shown in days.

**Reliability rating**

- A or 1 = 0 Bug
- B or 2 = at least 1 Minor Bug
- C or 3 = at least 1 Major Bug
- D or 4 = at least 1 Critical Bug
- E or 5 = at least 1 Blocker Bug


#### Security

[![Vulnerabilities](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=vulnerabilities)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=vulnerabilities)
[![Security remediation effort](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=security_remediation_effort)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=security_remediation_effort)
[![Security Rating](https://sonarcloud.io/api/badges/measure?key=fbrgsmn.mobile.app&metric=security_rating)](https://sonarcloud.io/component_measures?id=fbrgsmn.mobile.app&metric=security_rating)


**Security remediation effort**

Effort to fix all vulnerability issues. The measure is stored in minutes in the DB. An 8-hour day is assumed when values are shown in days.

**Security rating**

- A = 0 Vulnerability
- B = at least 1 Minor Vulnerability
- C = at least 1 Major Vulnerability
- D = at least 1 Critical Vulnerability
- E = at least 1 Blocker Vulnerability
