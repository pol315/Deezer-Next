// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {       
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'deezer.com' },
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});

function httpGet(theUrl) {
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function playSong() {
  //TODO provide an interface to replace the uid
  //     or could we pull the uid straight from the initial Deezer page, or a cookie?
  
  //TODO optimize, we can probably get away with making less web requests
  
  //TODO possibly cache all the artist IDs? and have a button to update the extension ID cache
  var uid="447219283"
  var currentinc=0 //use to store current increment of 50 for our index
  var artisturl="http://api.deezer.com/user/" + uid + "/artists?index=" + currentinc + "&limit=50"
  
  var obj=JSON.parse(httpGet(artisturl))
  var totalartists=obj.total
  var artistscrapes=Math.ceil((totalartists/50)) //number of times we must request artist url
  
  var artistids=[]
  
  for (i = 0; i < artistscrapes; i++) { 
    var newobj=JSON.parse(httpGet(artisturl))
	currentinc = currentinc + 50
	artisturl="http://api.deezer.com/user/" + uid + "/artists?index=" + currentinc + "&limit=50"
	for (var artist in newobj.data) {
		artistids[artistids.length] = (newobj.data[artist]).id
	}
  }
  
  //TODO verify this random does what I think it does
  var finalartist=artistids[Math.floor(Math.random() * (totalartists - 1))]
  
  var albumurl="http://api.deezer.com/artist/" + finalartist + "/albums"
  var albumids=[]
  var newobj=JSON.parse(httpGet(albumurl))
  var totalalbums=newobj.total
  for (var album in newobj.data) {
	albumids[albumids.length] = (newobj.data[album]).id
  }
  
  var finalalbum=albumids[Math.floor(Math.random() * (totalalbums - 1))]
  
  var trackurl="http://api.deezer.com/album/" + finalalbum + "/tracks"
  var trackids=[]
  var tracksobj=JSON.parse(httpGet(trackurl))
  var totaltracks=tracksobj.total
  for (var track in tracksobj.data) {
	trackids[trackids.length] = (tracksobj.data[track]).id
  }
  
  var rand = Math.floor(Math.random() * (totaltracks - 1))
  var finaltrack=trackids[rand]
  var duration = tracksobj.data[rand].duration
  
  //play dat track!
  var finalurl="http://www.deezer.com/track/" + finaltrack + "?autoplay=true"
  
  chrome.tabs.getCurrent(function () {
      chrome.tabs.update(null, {url: finalurl});
  });
  
  //TODO loop or recurse the playSong() method after a timeout of the song duration
  //setTimeout(playSong(), 15000)/*(duration + 5) * 1000)*/;
}

chrome.pageAction.onClicked.addListener(function(tab) {
  playSong();
});