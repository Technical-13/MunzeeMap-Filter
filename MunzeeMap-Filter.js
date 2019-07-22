// ==UserScript==
// @name         MunzeeMap Filter
// @namespace    none
// @version      2019.07.19.1212
// @downloadURL  https://greasyfork.org/en/scripts/387657-munzeemap-filter
// @updateURL    https://greasyfork.org/scripts/387657-munzeemap-filter/code/MunzeeMap%20Filter.user.js
// @author       technical13
// @supportURL   https://Discord.me/TheShoeStore
// @grant        none
// @include      https://www.munzee.com/map*
// @description  filter for munzee map
// ==/UserScript==
// jshint esversion: 6
// basedon: MunzeeMapFilterV2 by rynee
// basedon: https://greasyfork.org/en/scripts/11662-munzeemapv2
// basedon: MunzeeMapFilterV3 by CzPeet
// basedon: https://greasyfork.org/en/scripts/-munzeemapv3

var isDebug = false;
var intVerbosity = 0;
const ver = '2019.07.19.1212';
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

const arrBlastables = [
    'https://munzee.global.ssl.fastly.net/images/pins/virtual.png',
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_apricot.png',//                   Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_asparagus.png',//                 Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_black.png',//                     Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_blue.png',//                      Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_blue_green.png',//                Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_blue_violet.png',//               Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_cadet_blue.png',//                Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_brick_red.png',//                 Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_brown.png',//                     Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_burnt_sienna.png',//              Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_bittersweet.png',//               Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_burnt_orange.png',//              Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_chestnut.png',//                  Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_carnation_pink.png',//            Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_cornflower.png',//                Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_cerulean.png',//                  Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_dandelion.png',//                 Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_forest_green.png',//              Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_green_yellow.png',//              Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_gold.png',//                      Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_goldenrod.png',//                 Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_granny_smith_apple.png',//        Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_green.png',//                     Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_gray.png',//                      Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_indigo.png',//                    Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_melon.png',//                     Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_mauvelous.png',//                 Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_magenta.png',//                   Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_macaroni_and_cheese.png',//       Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_mahogany.png',//                  Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_olive_green.png',//               Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_orange.png',//                    Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_orchid.png',//                    Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_plum.png',//                      Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_pacific_blue.png',//              Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_purple_mountains_majesty.png',//  Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_periwinkle.png',//                Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_pink.png',//                      Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_peach.png',//                     Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_rainbow.png',//                   Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_red.png',//                       Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_red_orange.png',//                Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_raw_sienna.png',//                Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_robin_egg_blue.png',//            Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_red_violet.png',//                Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_salmon.png',//                    Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_spring_green.png',//              Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_sea_green.png',//                 Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_scarlet.png',//                   Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_silver.png',//                    Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_timberwolf.png',//                Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_tan.png',//                       Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_tickle_me_pink.png',//            Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_tumbleweed.png',//                Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_turquoise_blue.png',//            Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_violet.png',//                    Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_violet_red.png',//                Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_wild_strawberry.png',//           Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_wisteria.png',//                  Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_yellow.png',//                    Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_yellow_green.png',//              Virtual Color
    'https://munzee.global.ssl.fastly.net/images/pins/crossbow.png',//                          Clan Weapon
    'https://munzee.global.ssl.fastly.net/images/pins/virtualsapphire.png',//                   Jewel
    'https://munzee.global.ssl.fastly.net/images/pins/virtualemerald.png',//                    Jewel
    'https://munzee.global.ssl.fastly.net/images/pins/flathammock.png',//                       Flat Friend
    'https://munzee.global.ssl.fastly.net/images/pins/flatlou.png',//                           Flat Friend
    'https://munzee.global.ssl.fastly.net/images/pins/flatmatt.png',//                          Flat Friend
    'https://munzee.global.ssl.fastly.net/images/pins/flatrob.png',//                           Flat Friend
    'https://munzee.global.ssl.fastly.net/images/pins/carnationseed.png',//                     Carnation-1
    'https://munzee.global.ssl.fastly.net/images/pins/carnationgermination.png',//              Carnation-2
    'https://munzee.global.ssl.fastly.net/images/pins/carnationgrowth.png',//                   Carnation-3
    'https://munzee.global.ssl.fastly.net/images/pins/carnationbud.png',//                      Carnation-4
    'https://munzee.global.ssl.fastly.net/images/pins/pinkcarnationblossom.png',//              Carnation-5
    'https://munzee.global.ssl.fastly.net/images/pins/redcarnationblossom.png',//               Carnation-5
    'https://munzee.global.ssl.fastly.net/images/pins/violetcarnationblossom.png',//            Carnation-5
    'https://munzee.global.ssl.fastly.net/images/pins/whitecarnationblossom.png',//             Carnation-5
    'https://munzee.global.ssl.fastly.net/images/pins/yellowcarnationblossom.png',//            Carnation-5
    'https://munzee.global.ssl.fastly.net/images/pins/chick.png',//                             Chicken-1
    'https://munzee.global.ssl.fastly.net/images/pins/chicken.png',//                           Chicken-2
    'https://munzee.global.ssl.fastly.net/images/pins/eggs.png',//                              Chicken-3
    'https://munzee.global.ssl.fastly.net/images/pins/firstwheel.png',//                        Car-1
    'https://munzee.global.ssl.fastly.net/images/pins/penny-farthingbike.png',//                Car-2
    'https://munzee.global.ssl.fastly.net/images/pins/musclecar.png',//                         Car-3
    'https://munzee.global.ssl.fastly.net/images/pins/carrotseed.png',//                        Carrot-1
    'https://munzee.global.ssl.fastly.net/images/pins/carrotplant.png',//                       Carrot-2
    'https://munzee.global.ssl.fastly.net/images/pins/carrot.png',//                            Carrot-3
    'https://munzee.global.ssl.fastly.net/images/pins/colt.png',//                              Horse-1
    'https://munzee.global.ssl.fastly.net/images/pins/racehorse.png',//                         Horse-2
    'https://munzee.global.ssl.fastly.net/images/pins/championshiphorse.png',//                 Horse-3
    'https://munzee.global.ssl.fastly.net/images/pins/peasseed.png',//                          Peas-1
    'https://munzee.global.ssl.fastly.net/images/pins/peasplant.png',//                         Peas-2
    'https://munzee.global.ssl.fastly.net/images/pins/peas.png',//                              Peas-3
    'https://munzee.global.ssl.fastly.net/images/pins/pottedplant.png',//                       Field-1
    'https://munzee.global.ssl.fastly.net/images/pins/garden.png',//                            Field-2
    'https://munzee.global.ssl.fastly.net/images/pins/field.png',//                             Field-3
    'https://munzee.global.ssl.fastly.net/images/pins/farmer.png',//                            Farmer-1
    'https://munzee.global.ssl.fastly.net/images/pins/farmerandwife.png',//                     Farmer-2
    'https://munzee.global.ssl.fastly.net/images/pins/family.png',//                            Farmer-3
    'https://munzee.global.ssl.fastly.net/images/pins/canoe.png',//                             Canoe-1
    'https://munzee.global.ssl.fastly.net/images/pins/motorboat.png',//                         Canoe-2
    'https://munzee.global.ssl.fastly.net/images/pins/submarine.png',//                         Canoe-3
    'https://munzee.global.ssl.fastly.net/images/pins/safaritruck.png',//                       Safari-1
    'https://munzee.global.ssl.fastly.net/images/pins/safarivan.png',//                         Safari-2
    'https://munzee.global.ssl.fastly.net/images/pins/safaribus.png',//                         Safari-3
    'https://munzee.global.ssl.fastly.net/images/pins/temporaryvirtual.png'//                   Temp
];
const arrNonBlastables = [
    'https://munzee.global.ssl.fastly.net/images/pins/magic8ball.png',//                        LIMITED TIME
    'https://munzee.global.ssl.fastly.net/images/pins/flatshuttle.png',//                       LIMITED TIME
    'https://munzee.global.ssl.fastly.net/images/pins/australiaglobalgrub.png',//               MOB-Grub
    'https://munzee.global.ssl.fastly.net/images/pins/franceglobalgrub.png',//                  MOB-Grub
    'https://munzee.global.ssl.fastly.net/images/pins/japanglobalgrub.png',//                   MOB-Grub
    'https://munzee.global.ssl.fastly.net/images/pins/mexicoglobalgrub.png',//                  MOB-Grub
    'https://munzee.global.ssl.fastly.net/images/pins/usaglobalgrub.png',//                     MOB-Grub
    'https://munzee.global.ssl.fastly.net/images/pins/retiredpegasus.png',//                    MOB-RM/ZP
    'https://munzee.global.ssl.fastly.net/images/pins/nomadvirtual.png',//                      MOB-Nomad
    'https://munzee.global.ssl.fastly.net/images/pins/travelernomad.png',//                     MOB-Nomad
    'https://munzee.global.ssl.fastly.net/images/pins/virtualflatnomad.png',//                  MOB-Nomad
    'https://munzee.global.ssl.fastly.net/images/pins/firepegasus.png',//                       SOB
    'https://munzee.global.ssl.fastly.net/images/pins/cyclops_virtual.png',//                   PRB
    'https://munzee.global.ssl.fastly.net/images/pins/pegasus.png',//                           PRB
    'https://munzee.global.ssl.fastly.net/images/pins/australiaiconiclocation.png',//           AUHL
    'https://munzee.global.ssl.fastly.net/images/pins/czechrepubliciconiclocation.png',//       CRHL
    'https://munzee.global.ssl.fastly.net/images/pins/cahistoricallocation.png',//              CHL
    'https://munzee.global.ssl.fastly.net/images/pins/flhistoricallocation.png',//              FHL
    'https://munzee.global.ssl.fastly.net/images/pins/greatbritainiconiclocation.png',//        GBHL
    'https://munzee.global.ssl.fastly.net/images/pins/iconiclocation.png',//              SHL
    'https://munzee.global.ssl.fastly.net/images/pins/txhistoricallocation.png',//              THL
    'https://munzee.global.ssl.fastly.net/images/pins/wahistoricallocation.png',//              WHL
    'https://munzee.global.ssl.fastly.net/images/pins/worldheritagehistoricallocation.png',//   WHHL
    'https://munzee.global.ssl.fastly.net/images/pins/airmystery.png',//                        Elemental
    'https://munzee.global.ssl.fastly.net/images/pins/feather.png',//                           Elemental
    'https://munzee.global.ssl.fastly.net/images/pins/goldenfeather.png',//                     Elemental
    'https://munzee.global.ssl.fastly.net/images/pins/nightvisiongoggles.png',//                ZeeCret Weapon
    'https://munzee.global.ssl.fastly.net/images/pins/infraredvirtual.png',//                   ZeeCret Weapon
    'https://munzee.global.ssl.fastly.net/images/pins/joystickvirtual.png',//                   Joystick
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_amethyst.png',//                  Jewel
    'https://munzee.global.ssl.fastly.net/images/pins/catapult.png',//                          Clan Weapon
    'https://munzee.global.ssl.fastly.net/images/pins/surprise.png',//                          Surprise
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_trail.png',//                     Virtual Trail
    'https://munzee.global.ssl.fastly.net/images/pins/virtual_resort.png'//                     Destination
];
const arrPOI = [
    'https://munzee.global.ssl.fastly.net/images/pins/poiairport.png',//                        POI
    'https://munzee.global.ssl.fastly.net/images/pins/poicemetery.png',//                       POI
    'https://munzee.global.ssl.fastly.net/images/pins/poicinema.png',//                         POI
    'https://munzee.global.ssl.fastly.net/images/pins/poifaithplace.png',//                     POI
    'https://munzee.global.ssl.fastly.net/images/pins/poifirstresponders.png',//                POI
    'https://munzee.global.ssl.fastly.net/images/pins/poihistoricalplace.png',//                POI
    'https://munzee.global.ssl.fastly.net/images/pins/poihospital.png',//                       POI
    'https://munzee.global.ssl.fastly.net/images/pins/poilibrary.png',//                        POI
    'https://munzee.global.ssl.fastly.net/images/pins/poimuseum.png',//                         POI
    'https://munzee.global.ssl.fastly.net/images/pins/poiplaypark.png',//                       POI
    'https://munzee.global.ssl.fastly.net/images/pins/poipostoffice.png',//                     POI
    'https://munzee.global.ssl.fastly.net/images/pins/poisports.png',//                         POI
    'https://munzee.global.ssl.fastly.net/images/pins/poitransportation.png',//                 POI
    'https://munzee.global.ssl.fastly.net/images/pins/poiuniqueattraction.png',//               POI
    'https://munzee.global.ssl.fastly.net/images/pins/poiuniversity.png',//                     POI
    'https://munzee.global.ssl.fastly.net/images/pins/poiwildlife.png',//                       POI
    'https://munzee.global.ssl.fastly.net/images/pins/poivirtualgarden.png'//                   POI
];
const arrSpecials = [
    'https://munzee.global.ssl.fastly.net/images/pins/retiredcyclops',//                        MOB - RM/ZP
    'https://munzee.global.ssl.fastly.net/images/pins/cherub.png',//                            SOB
    'https://munzee.global.ssl.fastly.net/images/pins/chimera.png',//                           SOB
    'https://munzee.global.ssl.fastly.net/images/pins/fairygodmother.png',//                    SOB - Fairy
    'https://munzee.global.ssl.fastly.net/images/pins/gorgon.png',//                            SOB - Banshee
    'https://munzee.global.ssl.fastly.net/images/pins/hadavale',//                              SOB
    'https://munzee.global.ssl.fastly.net/images/pins/ogre',//                                  SOB
    'https://munzee.global.ssl.fastly.net/images/pins/coldflatrob.png',//                       PRB - FFR
    'https://munzee.global.ssl.fastly.net/images/pins/tuxflatrob.png',//                        PRB - FFR
    'https://munzee.global.ssl.fastly.net/images/pins/beachflatrob.png',//                      PRB - FFR
    'https://munzee.global.ssl.fastly.net/images/pins/face-offflatmatt.png',//                  PRB - FFM
    'https://munzee.global.ssl.fastly.net/images/pins/footyflatmatt.png',//                     PRB - FFM
    'https://munzee.global.ssl.fastly.net/images/pins/matt\'erupflatmatt.png',//                PRB - FFM
    'https://munzee.global.ssl.fastly.net/images/pins/cyclops.png',//                           PRB - Cyclops
    'https://munzee.global.ssl.fastly.net/images/pins/alicornpegasus.png',//                    PRB - Pegasus
    'https://munzee.global.ssl.fastly.net/images/pins/chinesedragon.png',//                     PRB - Dragon
    'https://munzee.global.ssl.fastly.net/images/pins/wyverndragon.png',//                      PRB - Dragon
    'https://munzee.global.ssl.fastly.net/images/pins/banshee',//                               PRB - Banshee
    'https://munzee.global.ssl.fastly.net/images/pins/limebutterfly',//                         PRB - Butterfly
    'https://munzee.global.ssl.fastly.net/images/pins/monarchbutterfly',//                      PRB - Butterfly
    'https://munzee.global.ssl.fastly.net/images/pins/morphobutterfly',//                       PRB - Butterfly
    'https://munzee.global.ssl.fastly.net/images/pins/fairy',//                                 PRB - Fairy
    'https://munzee.global.ssl.fastly.net/images/pins/dryadfairy',//                            PRB - Fairy
    'https://munzee.global.ssl.fastly.net/images/pins/wildfirefairy',//                         PRB - Fairy
    'https://munzee.global.ssl.fastly.net/images/pins/centaurfaun',//                           PRB - Faun
    'https://munzee.global.ssl.fastly.net/images/pins/krampusfaun',//                           PRB - Faun
    'https://munzee.global.ssl.fastly.net/images/pins/dwarfleprechaun',//                       PRB - Leprechaun
    'https://munzee.global.ssl.fastly.net/images/pins/goblinleprechaun',//                      PRB - Leprechaun
    'https://munzee.global.ssl.fastly.net/images/pins/melusinemermaid',//                       PRB - Mermaid
    'https://munzee.global.ssl.fastly.net/images/pins/alicornpegasus',//                        PRB - Mermaid
    'https://munzee.global.ssl.fastly.net/images/pins/griffinpegasus',//                        PRB - Pegasus
    'https://munzee.global.ssl.fastly.net/images/pins/pimedus',//                               PRB
    'https://munzee.global.ssl.fastly.net/images/pins/bcagarden.png',//         UNKOWN BLASTABILITY
    'https://munzee.global.ssl.fastly.net/images/pins/getfitmunzeetrail.png',// UNKOWN BLASTABILITY
    'https://munzee.global.ssl.fastly.net/images/pins/pawgarden.png',//         UNKOWN BLASTABILITY
    'https://munzee.global.ssl.fastly.net/images/pins/mwtxusa.png',//           UNKOWN BLASTABILITY
    'https://munzee.global.ssl.fastly.net/images/pins/captured_virtual.png',
    'https://munzee.global.ssl.fastly.net/images/pins/owned_virtual.png'
];

// $( '#footer' ).remove();
$( 'head' ).append( $( '<style>' +
                      '.ico_show { background-color: #88FF88; }' +
                      '.ico_hide { opacity: 0.4; background-color: #FF8888; }' +
                      '.unknown_type { border: 1px solid #0000FF; }' +
                      '.v_blast { border: 2px solid #00FF00; }' +
                      '.v_non { border: 1px solid #FF0000; }' +
                      '.v_poi { border: 1px solid #EA6426; }' +
                      '.v_special { border: 1px solid #FF6666; }' +
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
var disabledIcons = [];
var imgSRC = '';

function createfilter4Map() {
    iconCounter = {};
    filterIcons.empty();

    //Collection
    for ( var munzeeID in mapMarkers ) {
        //img src
        imgSRC = mapMarkers[ munzeeID ]._element.style.backgroundImage.replace( 'url("', '' ).replace( '")', '' );

        if ( typeof iconCounter[ imgSRC ] == 'undefined' ) { iconCounter[ imgSRC ] = 1; }
        else { iconCounter[ imgSRC ]++; }
    }

    //Creation
    for ( imgSRC in iconCounter ) {
        let strType = imgSRC.split( '/' )[ imgSRC.split( '/' ).length - 1 ].split( '.' )[ 0 ];
        let isVirtual = false;
        let isBlastable = false;
        let isPOI = false;
        let isSpecial = false;

        if ( arrBlastables.indexOf( imgSRC ) >= 0 ) {
            isBlastable = true;
        }
        if ( arrPOI.indexOf( imgSRC ) >= 0 ) {
            isPOI = true;
        }
        if ( arrSpecials.indexOf( imgSRC ) >= 0 ) {
            isSpecial = true;
        }
        if ( arrNonBlastables.indexOf( imgSRC ) >= 0 || isBlastable || isPOI || isSpecial ) {
            isVirtual = true;
        }

        console.log(
            'Virtual: %s\tBlastable: %s\tPOI: %s\tSpecial: %s\tDisabled: %s\tType: %s',
            ( isVirtual ? 'yes' : ' no' ),
            ( isBlastable ? 'yes' : ' no' ),
            ( isPOI ? 'yes' : ' no' ),
            ( isSpecial ? 'yes' : ' no' ),
            ( disabledIcons.indexOf( imgSRC ) >= 0 ? 'yes' : ' no' ),
            strType
        );

        //new element
        filterIcons.append (
            '<div class="pull-left filter_icon">' +
            '<div>' + iconCounter[ imgSRC ] + '</div>' +
            '<img class="haideris ' + ( isVirtual ? ( isBlastable ? 'v_blast ' : 'v_non ' ) + ( isPOI ? 'v_poi ' : '' ) + ( isSpecial ? 'v_special ' : '' ) : 'unknown_type ' ) + ( disabledIcons.indexOf( imgSRC ) >= 0 ? 'ico_hide' : 'ico_show' ) + '" src=' + imgSRC + ' />' +
            '</div>'
        );
    }

    filterIcons.append( '<div style="clear: both; height: 1px; overflow: hidden;"></div>' );

    updateMapIcons();
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
        console.log( 'icons: %o', icons );
        disabledIcons = [];
        for ( var ic in iconCounter ) {
            if ( ic != curr ) { disabledIcons.push( ic ); }
        }
        console.log( 'disabledIcons: %o', disabledIcons );

        for ( var i in icons ) {
            console.log( 'icons[ i ] is a: %o', typeof( icons[ i ] ) );
            if ( typeof( icons[ i ] ) === 'object' ) {
              let intIcoShowHide = -1;
              let strNewClass = Array.from( icons[ i ].classList );
              console.log( 'Testing if `%o` != `%o`: %s', icons[ i ].src, curr, ( icons[ i ].src != curr ? 'NOT ' : '') + 'equal' );
              if ( icons[ i ].src != curr ) {
                intIcoShowHide = strNewClass.indexOf( 'ico_show' );
                strNewClass[ intIcoShowHide ] = 'ico_hide';
              } else {
                intIcoShowHide = strNewClass.indexOf( 'ico_hide' );
                strNewClass[ intIcoShowHide ] = 'ico_show';
              }
              strNewClass = strNewClass.join( ' ' );
              console.log( 'Replacing classList %o with string `%s`', icons[ i ].classList, strNewClass );
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
        console.log( 'icons: %o', icons );
        disabledIcons = [];
        for ( var ic in iconCounter ) {
            if ( ic == curr ) { disabledIcons.push( ic ); }
        }
        console.log( 'disabledIcons: %o', disabledIcons );

        for ( var i in icons ) {
            console.log( 'icons[ i ] is a: %o', typeof( icons[ i ] ) );
            if ( typeof( icons[ i ] ) === 'object' ) {
              let intIcoShowHide = -1;
              let strNewClass = Array.from( icons[ i ].classList );
              console.log( 'Testing if `%o` != `%o`: %s', icons[ i ].src, curr, ( icons[ i ].src != curr ? 'NOT ' : '') + 'equal' );
              if ( icons[ i ].src != curr ) {
                intIcoShowHide = strNewClass.indexOf( 'ico_hide' );
                strNewClass[ intIcoShowHide ] = 'ico_show';
              } else {
                intIcoShowHide = strNewClass.indexOf( 'ico_show' );
                strNewClass[ intIcoShowHide ] = 'ico_hide';
              }
              strNewClass = strNewClass.join( ' ' );
              console.log( 'Replacing classList %o with string `%s`', icons[ i ].classList, strNewClass );
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
