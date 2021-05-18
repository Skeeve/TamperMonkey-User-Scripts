// ==UserScript==
// @name     s.to B Auto-Follow to Hoster
// @version  6
// @grant    none
// @include  https://serien.sx/serie/stream/*/staffel-*/episode-*
// @include  https://serien.vc/serie/stream/*/staffel-*/episode-*
// @include  https://s.to/serie/stream/*/staffel-*/episode-*
// @include  https://serien.ac/serie/stream/*/staffel-*/episode-*
// @include  https://serien.*/serie/stream/*/staffel-*/episode-*
// @include  https://serienstream.sx/serie/stream/*/staffel-*/episode-*
// ==/UserScript==

// These episodes I want to get in english
var english= [
	'The Orville',
  /* 'Death in Paradise',*/
  /*'Young Sheldon',*/
  'The Big Bang Theory',
  'Doctor Who',
];

var sep = '__';

function do_stuff() {
  try {
    // Get the name of the series
    var series= document.querySelector('div.hosterSeriesTitle').textContent;

    // get the season and episode
    var siteTitle=document.querySelector('div.hosterSiteTitle');
		var season= siteTitle.getAttribute('data-season');
		var episode= siteTitle.getAttribute('data-episode');
    var title= siteTitle.querySelector('h2 :first-child').textContent;

    // get the current language
    var lng= document.querySelector("img.selectedLanguage");
    var currentLanguage = lng.getAttribute("data-lang-key");
    var seasondir='Staffel';

    // Is it a series watched in english?
    if ( english.indexOf(series) >= 0 ) {
      // Do we have it in english?
      var en= document.querySelector("img[title='Englisch']");
      if ( en !== null ) {
        // Yes, so we will take that
        currentLanguage= en.getAttribute("data-lang-key");
        title= siteTitle.querySelector('h2 .episodeEnglishTitel').textContent;
      }
    }
    if (currentLanguage == "2") {
      seasondir='Season';
    }
    // set the window name to the info just found
    window.name= [series, season, episode, title, seasondir].join(sep).replace(/\s*[:\/]\s*/g, ' - ');

    // preferred hosters
    var hosters= [ "Streamcloud", "Openload", "Streamango" ];
    // was a hoster appended?
    var hoster= document.location.hash.replace(/^#/, '');
    // Then push it to the front
    if (hoster !== "") {
      hosters.push(hoster);
    }

    // Try to find a link for the preferred hoster and language
    var n= null;
    while (n === null) {
      if (hosters.length < 1) {
        throw "No preferred hoster found";
      }
      hoster= hosters.pop();
      n= document.querySelector("li[data-lang-key='"+currentLanguage+"'] i.icon." + hoster);
    }
    console.log(hoster);

    // go to that page
    while (n.nodeName !== "LI") {
      n= n.parentNode;
    }
      let newLocation = n.getAttribute('data-link-target') + "#" + window.name;
      console.log(newLocation);
      document.location= newLocation;
  }
  catch (e) {
    console.log(e);
  }
}

do_stuff();

