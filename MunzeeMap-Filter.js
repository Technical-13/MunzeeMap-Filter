// ==UserScript==
// @name         MunzeeMap Filter
// @namespace    none
// @version      2019.07.22.1942
// @downloadURL  https://greasyfork.org/en/scripts/387657-munzeemap-filter
// @updateURL    https://greasyfork.org/scripts/387657-munzeemap-filter/code/MunzeeMap%20Filter.user.js
// @author       technical13
// @supportURL   https://Discord.me/TheShoeStore
// @include      https://www.munzee.com/map*
// @grant        GM_getResourceText
// @resource     physicals  https://github.com/Technical-13/MunzeeMap-Filter/blob/master/physicals.json
// @resource     rovers     https://github.com/Technical-13/MunzeeMap-Filter/blob/master/rovers.json
// @resource     POIs       https://github.com/Technical-13/MunzeeMap-Filter/blob/master/POIs.json
// @resource     noblast    https://github.com/Technical-13/MunzeeMap-Filter/blob/master/nonblastable.json
// @resource     blastable  https://github.com/Technical-13/MunzeeMap-Filter/blob/master/blastable.json
// @resource     special    https://github.com/Technical-13/MunzeeMap-Filter/blob/master/specials.json
// @description  filter for munzee map
// ==/UserScript==
// jshint esversion: 6
// basedon: MunzeeMapFilterV2 by rynee
// basedon: https://greasyfork.org/en/scripts/11662-munzeemapv2
// basedon: MunzeeMapFilterV3 by CzPeet
// basedon: https://greasyfork.org/en/scripts/-munzeemapv3

var isDebug = false;
var intVerbosity = 0;
const ver = '2019.07.22.1942';
const scriptName = 'MunzeeMap Filter v' + ver;

function log( intV, strConsole, strLog, ...arrArgs ) {
    if ( intV === undefined ) { intV = 0; }
    if ( strConsole === undefined ) { strConsole = 'log'; }
    if ( strLog === undefined ) { strLog = '%o'; }
    if ( intVerbosity >= intV && ( strConsole === 'groupEnd' ) ) { console[ strConsole ](); }
    if ( intV === 0 || ( isDebug && intVerbosity >= intV ) ) { console[ strConsole ]( '[%i]: %s: ' + strLog, intV, scriptName, ...arrArgs ); }
}

function toBoolean( val ) {
    const arrTrue = [ undefined, null, '', true, 'true', 1, '1', 'on', 'yes' ];
    val = ( typeof( val ) === 'string' ? val.toLowerCase() : val );

    log( 4, 'log', 'toBoolean() is returning: %o', ( arrTrue.indexOf( val ) !== -1 ? true : false ) );
    return ( arrTrue.indexOf( val ) !== -1 ? true : false );
}

const intParamsStart = ( document.URL.indexOf( '?' ) + 1 );
const strParams = document.URL.substr( intParamsStart );
const arrParamSets = strParams.split( '&' );
var objParams = {};
arrParamSets.forEach( function( strParam ) {
    let arrParam = strParam.split( '=' );
    let strParamName = ( arrParam[ 0 ].toLowerCase() || '' );
    if ( strParamName === 'verbosity' ) {
        isDebug = true;
        intVerbosity = ( arrParam[ 1 ] ? ( parseInt( arrParam[ 1 ] ) < 0 ? 0 : ( parseInt( arrParam[ 1 ] ) > 9 ? 9 : parseInt( arrParam[ 1 ] ) ) ) : 9 );
    } else if ( strParamName === 'debug' ) {
        isDebug = toBoolean( arrParam[ 1 ] );
        intVerbosity = 1;
    }
} );

log( 1, 'warn', 'Debug mode is on with verbosity level: %o', intVerbosity );
log( 1, 'groupCollapsed', 'Verbosity options: (click to expand)' );
log( 1, 'log', '\n\t1) Summary\n\t2) Parameters retrieved from URL\n\t3) Variables set\n\t4) Function returns\n\t9) ALL debugging info and this notice.' );
log( 1, 'groupEnd' );

const arrPhysicals = GM_getResourceText( 'physicals' );
const arrBlastables = GM_getResourceText( 'blastable' );
const arrNonBlastables = GM_getResourceText( 'noblast' );
const arrPOI = GM_getResourceText( 'POIs' );
const arrSpecials = GM_getResourceText( 'special' );
const arrRovers = GM_getResourceText( 'rovers' );

// $( '#footer' ).remove();
$( 'head' ).append( $( '<style>' +
                      '.v_blast { border: 2px inset #00FF00; }' +
                      '.v_non { border: 2px inset #FF0000; }' +
                      '.v_poi { border: 2px inset #EA6426; }' +
                      '.physical { border: 2px inset #FF0000; }' +
                      '.rover { border: 2px double #FF0000; }' +
                      '.v_special { border: 2px inset #FF6666; }' +
                      '.ico_show { background-color: #88FF88; }' +
                      '.ico_hide { opacity: 0.4; background-color: #FF8888; border-style: outset; }' +
                      '.unknown_type { border-width: 3px; border-style: dashed dotted; border-color: #FF0000; }' +
                      '.filter_icon { padding: 0px 1px 0px 0px; }' +
                      '.filter_icon > div { text-align: center; }' +
                      '.filter_icon > img { height: 30px; cursor: pointer; border-radius: 5px; }' +
                      '.filter_icon > img.img_hide { opacity: 0.4; }' +
                      '#filterIcons { padding: 5px; background-color: #FFFFFF; }' +
                      '#inputbar { background-color: #FFFFFF; top: 30px; border-top: 1px solid #FFFFFF; }' +
                      '</style>' ) );
$( '.panel.panel-default' ).css( 'margin-bottom', '0px' );
$( '.row' ).css( 'margin', '0px' );
$( '.panel-body' ).css( 'padding-left', '0px' ).css( 'padding-right', '0px' );

var inputbar = $( '#inputbar' );
var filterIcons = $( '<div id="filterIcons"></div>' );
inputbar.append( filterIcons );

var iconCounter = {};
var objAllIcons = {};
var disabledIcons = [];
var imgSRC = '';

function createfilter4Map() {
    iconCounter = {};
    filterIcons.empty();

    //Collection
    for ( var munzeeID in mapMarkers ) {
        //img src
        imgSRC = mapMarkers[ munzeeID ]._element.style.backgroundImage.replace( 'url("', '' ).replace( '")', '' );
        let strType = imgSRC.split( '/' )[ imgSRC.split( '/' ).length - 1 ].split( '.' )[ 0 ];

        if ( typeof iconCounter[ imgSRC ] == 'undefined' ) { iconCounter[ imgSRC ] = 1; }
        else { iconCounter[ imgSRC ]++; }

        if ( objAllIcons[ strType ] === undefined ) { objAllIcons[ strType ] = []; }
        objAllIcons[ strType ].push( munzeeID );
    }

    //Creation
    for ( imgSRC in iconCounter ) {
        let strType = imgSRC.split( '/' )[ imgSRC.split( '/' ).length - 1 ].split( '.' )[ 0 ];
        let isPhysical = ( arrPhysicals.indexOf( imgSRC ) >= 0 ? true : false );
        let isBlastable = ( arrBlastables.indexOf( imgSRC ) >= 0 ? true : false );
        let isNonBlastable = ( arrNonBlastables.indexOf( imgSRC ) >= 0 ? true : false );
        let isPOI = ( arrPOI.indexOf( imgSRC ) >= 0 ? true : false );
        let isSpecial = ( arrSpecials.indexOf( imgSRC ) >= 0 ? true : false );
        let isVirtual = ( isNonBlastable || isBlastable || isPOI || isSpecial ? true : false );
        let isRover = ( arrRovers.indexOf( imgSRC ) >= 0 ? true : false );

        if ( isPhysical || isVirtual || isRover ) {
            delete objAllIcons[ strType ];
        }

/*        console.log(
            'Virtual: %s\tBlastable: %s\tPOI: %s\tSpecial: %s\tDisabled: %s\tType: %s',
            ( isVirtual ? 'yes' : ' no' ), ( isBlastable ? 'yes' : ' no' ),
            ( isPOI ? 'yes' : ' no' ), ( isSpecial ? 'yes' : ' no' ),
            ( disabledIcons.indexOf( imgSRC ) >= 0 ? 'yes' : ' no' ), strType );//*/

        //new element
        filterIcons.append (
            '<div class="pull-left filter_icon">' +
            '<div>' + iconCounter[ imgSRC ] + '</div>' +
            '<img class="haideris ' + ( isRover ? 'rover ' : ( isVirtual ? ( isBlastable ? 'v_blast ' : 'v_non ' ) + ( isPOI ? 'v_poi ' : '' ) + ( isSpecial ? 'v_special ' : '' ) : ( isPhysical ? 'physical ' : 'unknown_type ' ) ) ) + ( disabledIcons.indexOf( imgSRC ) >= 0 ? 'ico_hide' : 'ico_show' ) + '" src="' + imgSRC + '" />' +
            '</div>'
        );
    }

    filterIcons.append( '<div style="clear: both; height: 1px; overflow: hidden;"></div>' );

    updateMapIcons();

    // Submit GitHub issue for unknown types
    var arrAllIconTypes = Object.keys( objAllIcons );
    var intAIT = arrAllIconTypes.length;
    if ( intAIT > 0 ) {
        let isReporter = JSON.parse( localStorage.getItem( 'MMF' ) ).isReporter;
        if ( isReporter === null ) {
            let beReporter = confirm( scriptName + ' has detected types of Munzees that are not indexed.\n\n\tWould you like to report these to the script owner when found?\n\nSelect OK to report or Cancel to hide these alerts forever¹.' );
            localStorage.setItem( 'MMF', JSON.stringify( { isReporter: beReporter } ) );
            isReporter = beReporter;
        }
        if ( isReporter ) {
            let doReport = confirm( '[ "' + arrAllIconTypes.join( '", "' ) + '" ] ' + ( intAIT === 1 ? 'is an' : 'are' ) + ' unknown Munzee type' + ( intAIT === 1 ? '' : 's' ) + ' to ' + scriptName + '.\n\n\t\t\tWould you like to let the script writter know about ' + ( intAIT === 1 ? 'it' : 'them' ) + '?' );
            if ( doReport ) {
                var strTitle = '?title=' + encodeURI( 'Unknown mapMarker(s) detected:' );
                var strBody = '&body=' + encodeURI( 'Found unknown mapMarker types:' );
                for ( let intTypeIndex in arrAllIconTypes ) {
                    let strType = arrAllIconTypes[ intTypeIndex ];
                    let arrList = objAllIcons[ strType ];
                    let strPinURL = mapMarkers[ arrList[ 0 ] ]._element.style.backgroundImage.replace( 'url("', '' ).replace( '")', '' );
                    strBody += '%0A%0A' + encodeURI( '![' + strType + '](' + strPinURL + '):' );
                    for ( var intMunzeeID in arrList ) {
                        let munzeeID = arrList[ intMunzeeID ];
                        let objCoords = mapMarkers[ munzeeID ]._lngLat;
                        let strGeoHash = geohash.encode( objCoords.lat,  objCoords.lng,9 );
                        let strMapLink = 'https://www.munzee.com/map/' + strGeoHash + '/16.0';
                        strBody += '%0A' + encodeURI( '* [' + objCoords.lat + ', ' + objCoords.lng + '](' + strMapLink + ')' );
                    }
                }
                window.open( 'https://github.com/Technical-13/MunzeeMap-Filter/issues/new' + strTitle + strBody, '_blank', 'menubar=no,toolbar=no,location=no,status=no,width=1000' );
            } else {
                console.info( 'List of unknown types detected: %o', arrAllIconTypes );
                let stopReporting = confirm( 'Would you like me to continue asking you to report unknown types?\n\nSelect OK to ask in the future or Cancel to hide these alerts forever¹.' );
                localStorage.setItem( 'MMF', JSON.stringify( { isReporter: stopReporting } ) );
            }
        } else {
            console.info( 'List of unknown types detected:\n\t%o\nWould you like to be a reporter when unknown types are found?  If so, use the following code here in the console:\n\nlocalStorage.setItem( \'MMF\', JSON.stringify( { isReporter: true } ) );', arrAllIconTypes );
        }
    }
}

function updateMapIcons() {
    for ( var mID in mapMarkers ) {
        var curr = mapMarkers[ mID ]._element.style.backgroundImage.replace( 'url("', '' ).replace( '")', '' );
        if ( $.inArray( curr, disabledIcons ) == -1 ) { $( "[data-index='" + mID + "']" ).css( 'display', 'block' ); }
        else { $( "[data-index='" + mID + "']" ).css( 'display', 'none' ); }
    }
}

// hide
$( document ).on( 'click', '.ico_show.haideris', function ( e ) {
    var curr = $( this ).attr( 'src' );

    if ( e.ctrlKey ) {
        var icons = document.querySelectorAll( '.haideris' );
//        console.log( 'icons: %o', icons );
        disabledIcons = [];
        for ( var ic in iconCounter ) {
            if ( ic != curr ) { disabledIcons.push( ic ); }
        }
//        console.log( 'disabledIcons: %o', disabledIcons );

        for ( var i in icons ) {
//            console.log( 'icons[ i ] is a: %o', typeof( icons[ i ] ) );
            if ( typeof( icons[ i ] ) === 'object' ) {
              let intIcoShowHide = -1;
              let strNewClass = Array.from( icons[ i ].classList );
//              console.log( 'Testing if `%o` != `%o`: %s', icons[ i ].src, curr, ( icons[ i ].src != curr ? 'NOT ' : '') + 'equal' );
              if ( icons[ i ].src != curr ) {
                intIcoShowHide = strNewClass.indexOf( 'ico_show' );
                strNewClass[ intIcoShowHide ] = 'ico_hide';
              } else {
                intIcoShowHide = strNewClass.indexOf( 'ico_hide' );
                strNewClass[ intIcoShowHide ] = 'ico_show';
              }
              strNewClass = strNewClass.join( ' ' );
//              console.log( 'Replacing classList %o with string `%s`', icons[ i ].classList, strNewClass );
              icons[ i ].className = strNewClass;
            }
        }
    }
    else {
        $( this ).removeClass( 'ico_show' ).addClass( 'ico_hide' );
        if ( disabledIcons.indexOf( curr ) == -1 ) { disabledIcons.push( curr ); }
    }
    updateMapIcons();
} );

// show
$( document ).on( 'click', '.ico_hide.haideris', function ( e ) {
    var curr = $( this ).attr( 'src' );

    if ( e.ctrlKey ) {
        var icons = document.querySelectorAll( '.haideris' );
//        console.log( 'icons: %o', icons );
        disabledIcons = [];
        for ( var ic in iconCounter ) {
            if ( ic == curr ) { disabledIcons.push( ic ); }
        }
//        console.log( 'disabledIcons: %o', disabledIcons );

        for ( var i in icons ) {
//            console.log( 'icons[ i ] is a: %o', typeof( icons[ i ] ) );
            if ( typeof( icons[ i ] ) === 'object' ) {
              let intIcoShowHide = -1;
              let strNewClass = Array.from( icons[ i ].classList );
//              console.log( 'Testing if `%o` != `%o`: %s', icons[ i ].src, curr, ( icons[ i ].src != curr ? 'NOT ' : '') + 'equal' );
              if ( icons[ i ].src != curr ) {
                intIcoShowHide = strNewClass.indexOf( 'ico_hide' );
                strNewClass[ intIcoShowHide ] = 'ico_show';
              } else {
                intIcoShowHide = strNewClass.indexOf( 'ico_show' );
                strNewClass[ intIcoShowHide ] = 'ico_hide';
              }
              strNewClass = strNewClass.join( ' ' );
//              console.log( 'Replacing classList %o with string `%s`', icons[ i ].classList, strNewClass );
              icons[ i ].className = strNewClass;
            }
        }
    }
    else {
        $( this ).removeClass( 'ico_hide' ).addClass( 'ico_show' );
        var index = disabledIcons.indexOf( curr );
        if ( index !== -1 )
        {
            disabledIcons.splice( index, 1 );
        }
    }
    updateMapIcons();
} );

$( document ).ajaxSuccess( createfilter4Map );
