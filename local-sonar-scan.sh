#!/bin/bash
set -e
set -o pipefail

START_TIME=$SECONDS

echo "##################################################"
echo "###         START LOCAL SONAR SCRIPT           ###"
echo "##################################################"

function readJson {
  UNAMESTR=`uname`
  if [[ "$UNAMESTR" == 'Linux' ]]; then
    SED_EXTENDED='-r'
  elif [[ "$UNAMESTR" == 'Darwin' ]]; then
    SED_EXTENDED='-E'
  fi;

  VALUE=`grep -m 1 "\"${2}\"" ${1} | sed ${SED_EXTENDED} 's/^ *//;s/.*: *"//;s/",?//'`

  if [ ! "$VALUE" ]; then
    echo "Error: Cannot find \"${2}\" in ${1}" >&2;
    exit 1;
  else
    echo $VALUE;
  fi;
}

runScan() {
    currentBranch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
    login=$1

    if [ "$currentBranch" == "master" ]; then
        echo "--------------------------------------------------"
        echo "/!\\/!\\/!\\        Didn't scan it!         /!\\/!\\/!\\"
        echo "Master branch will be scanned when you'll push it!"
        echo "--------------------------------------------------"
        exit 1;
    else
        VERSION=`readJson package.json version` || exit 1;
        echo "Run sonar-scan with following parameters:"
        echo "- Branch:     $currentBranch"
        echo "- Login:      $login"
        echo "- Version:    $VERSION"

        export PATH=/Users/Shared/sonar-scanner-3.0.3.778/bin:$PATH
        sonar-scanner -X -Dsonar.projectVersion=$VERSION -Dsonar.login=$login -Dsonar.branch.name=$currentBranch

        ELAPSED_TIME=$(($SECONDS - $START_TIME))
        echo "--------------------------------------------------"
        echo "\\o/ Finished local sonar scan in $ELAPSED_TIME seconds"
        echo "--------------------------------------------------"
        exit 0;
    fi;
}




usage() {
    echo "Please use as follows: "
    echo "  $0 [-l <sonar-login>]" 1>&2; exit 1;
}

while getopts "l:" option; do
    case "${option}" in
        l)
            l=${OPTARG}
            runScan $l
            ;;
        *)
            usage
            ;;
    esac
done
shift $((OPTIND-1))
if [ -z "${l}" ]; then
    usage
fi

