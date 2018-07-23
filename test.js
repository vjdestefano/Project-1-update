//Vincent Destefano
//Front End Developer


var closeYouTube = false;


function bTogglePage(bRequest3dOpen){
if(bRequest3dOpen){
$("#youTubeVid").hide(500);
$("#the3Dbox").slideDown(750);
closeYouTube = false;
if(!closeYouTube){
  $("#closeButton").attr("style","display: none;");
}
}else{
  $("#the3Dbox").hide(500);
  $("#youTubeVid").slideDown(750);
  closeYouTube = true
  if(closeYouTube){
    $("#closeButton").attr("style","");
  }
}
window.setTimeout(ant3d.Resize(),900);
}

$("#closeButton").on("click", function() {
  $("#the3Dbox").slideToggle();
  //   b3dOpen = true;
  $("#youTubeVid").slideToggle();
  //   $("#openButton").toggle();
  $("#closeButton").toggle();

  ant3d.Resize();
  });



var playPause = anime({
  targets: "#domAttributes .test",
  width: [
    {
      value: "200px",
      duration: 500,
      elasticity: 100,
      easing: "easeInOutQuart"
    },
    {
      value: "270px",
      duration: 500,
      elasticity: 500,
      easing: "easeInOutQuart"
    },
    { value: "335px", duration: 500, elasticity: 100, easing: "easeOutExpo" }
  ],
  backgroundColor: [
    { value: "#ef6c00", duration: 500 },
    { value: "#ef6c00", duration: 1000 },
    { value: "#FFF", duration: 800 }
  ],
  value: "100%",
  round: 1
});

var myObject = {
  Loading: "0%"
};
var JSobjectProp = anime({
  targets: myObject,
  duration: 1600,
  Loading: "100%",
  easing: "linear",
  round: 1,
  update: function() {
    var el = document.querySelector("#JSobjectProp pre");
    el.innerHTML = JSON.stringify(myObject);
  }
});

var clickAnime = anime({
  targets: ".clickThis",
  width: [
    {
      value: ($('.collapsible-header').innerWidth() * 1),
      duration: 500,
      elasticity: 100,
      easing: "easeInOutQuart",
      delay: 900
    },
    {
      value: "0px",
      duration: 500,
      elasticity: 100,
      easing: "easeInOutQuart",
      delay: 400
    }
  ],
  backgroundColor: [
    { value: "#ef6c00", duration: 500 },
    { value: "#ef6c00", duration: 800 }
  ],
  translateX: [
    {
      value: "0px",
      duration: 1300,
      elasticity: 100,
      easing: "easeInOutQuart",
      delay: 1600
    }
  ]
});

$(".collapsible-header").on("click", function(event) {
  clickAnime.restart();
  clickAnime.play();
});

// var b3dOpen = true;
// var tubeOpen = false;


$("#searchTest").on("keyup", function(event) {
  event.preventDefault();
  if (event.key === "Enter") {

  var testKey = $("#searchBarMain").val();
  console.log(testKey);
  if(testKey.length === 0){
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.text = "Please search for a valid term!";
    msg.pitch = 0.5;
    msg.rate = 0.4;

    window.speechSynthesis.speak(msg);
    return
  } else {
 event.preventDefault();
    bTogglePage(true);
   
    console.log(testKey);
    //$(".test").text(testKey);
    $("#test1").text(testKey);
    int3d.StartUp($("#rightherebaby"), testKey);
    JSobjectProp.restart();
    JSobjectProp.play();
    playPause.restart();
    playPause.play();
    $("#searchBarMain").val("");
   ant3d.Resize();
    

    
    
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.text = "searching for " + testKey;
    msg.pitch = 0.5;
    msg.rate = 0.4;

    window.speechSynthesis.speak(msg);

  }
   
  }
});



// $("#openButton").on("click", function() {
//   $("#the3Dbox").slideToggle();
//   b3dOpen = false;
//   $("#youTubeVid").slideToggle();
//   $("#closeButton").toggle();
//   $("#openButton").toggle();
// });

function displayFrom3D(giff, youtube, speechText){
  console.log(youtube);
  console.log(speechText);
  console.log(giff);
  if(speechText){
    
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.text = speechText;
    msg.pitch = 0.5;
    msg.rate = 0.4;

    window.speechSynthesis.speak(msg);
  }

  console.log(youtube);
  if(youtube){
    console.log(typeof youtube);
    $("#youTubeVid").empty();  
    bTogglePage(false);
    var testVid = $("<iframe>").attr("src","https://www.youtube.com/embed/" + youtube);
    //testVid.attr("style","display: none;")
    testVid.attr("id", "testVid");
    testVid.attr("width",($('#youTubeVid').innerWidth() * 1));
    testVid.attr("height",($('#youTubeVid').innerWidth() * .61))
    console.log(testVid);
    $("#youTubeVid").append(testVid);
  
    // $("#the3Dbox").slideToggle();
    // tubeOpen = true;

    // b3dOpen = false;
    
  }


  console.log(giff);
  if(giff){
    console.log(typeof giff);
  }

}



