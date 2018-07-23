//A.Napolitano  03/22/2018
//v.0.0.0.1.7 - 04/04/2018
//ant3d is a simple api extraction and 3d interface written in javascript and THREE.js
//It currently displays data from the API's: Wikipedia, Giffy and You Tube
//The script is interfaced by calling the ant3d.Startup method
//with the parameters SearchText, $(DomElement). See bottom of code for example.
//--Fixed Mouse  Detection
//--Fixed Api Callback Call structure 
//--A.A.N 3/26/2018
//--Added Cycle Controls and about
//--Moved copyright.
//--A.A.N 3/28/2018
//--YouTube Api/gapiMasterment contributed by Abu.
//--A.A.N 4/4/2018 adjusting cowbell...
//--A.A.N 2018-05-29 FixAPIPass1
//--A.A.N 2018-05-29 UnFixAPIPass1 Work on CORS issues
var ant3d = {
  bFirstTime: true,
  bDblClick: false,
  CurGiffy: '',
  CurYouTube: '',
  ReadText: '',
  callpage: '',
  friction: .995,
  DeltaX: 0,
  Wcoef: 1,
  Hcoef: 1,
  jRightHereBaby: '',
  tempcanvas: '',
  colGiffys: [],
  colYTVidIds: [],
  colYTVidImgs: [],
  rotspeed: 0,
  maxcharacterswide: 50,
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(),
  renderer: new THREE.WebGLRenderer(),
  //renderer: new THREE.CSS3DRenderer(),
  myheight: 0,
  mywidth: 0,
  mylastevent: '',
  ant3dMouse: new THREE.Vector2(),
  bBack: false,
  NewTex1: '',
  NewTex2: '',
  NewTex3: '',
  NewTex4: '',
  NewTex5: '',
  NewTex6: '',
  NewTex7: '',
  NewTex8: '',
  NewTex9: '',
  NewTex10: '',
  NewTex11: '',
  NewTex12: '',
  NewTex13: '',
  NewTex14: '',
  NewTex15: '',
  NewTex16: '',
  bProcessingGifs: false,
  colMovs: [],
  colHeadings: [],
  colArticles: [],
  colLinks: [],
  bFireDetectObjectsUnderMouse: false,
  Pedal: function (){
    ant3d.friction = .995;    
    ant3d.rotspeed += .01;
    
  },
  Break: function (){
    ant3d.friction = .995;
    ant3d.rotspeed -= .01;
    
  },
  Coast: function (){
    ant3d.friction = 1;
  
  },
  About:function(){
        ant3d.StartUp($("#rightherebaby"), 'Knowledge', displayFrom3D);
        let abt = 'Welcome to Cycler. Cycler allows you to obtain pure simultaneous knowledge from Giffy, WikiPedia and Youtube. Simply type in the search bar and enter your search. Knowledge cubes will surround you, DO NOT BE AFRAID. You may spin the cubes by swiping left and right. Tripple click or poke the cubes to interact with them, they will not anger; visibly. The circular icons on the row below the search and loading bar, allow you to Pedal, in multiple of your dimensions, or it can be used to remove friction, with the Cycle icon. Some functions unavailable in some local environments, while others, may bee; development ongoing. Enjoy the exploring.';
        ant3d.callpage('', '', abt);    
  },
  antDetectObjectsUnderMouse: function () {
    let col = [];
    if (!ant3d.bFireDetectObjectsUnderMouse) {
      return col;
    };
    $('#output').text(' ');
    ant3d.bFireDetectObjectsUnderMouse = false;
    //Detect Objects Under Mouse
    let ray = new THREE.Raycaster();
    ray.setFromCamera(ant3d.ant3dMouse, ant3d.camera);
    // calculate objects intersecting the picking ray
    col = ray.intersectObjects(ant3d.scene.children);
    return col;
  },
  getYouTubeData: function (inSrch) {
    gapi.client.setApiKey("AIzaSyBofD-GuDJbsXUs-eRaFlHrMmX7zF3vl24");
    gapi.client.load('youtube', 'v3', function () {
      ant3d.makeYouTubeRequest(inSrch);
    });
  },
  makeYouTubeRequest: function (inSrch) {
    let q = inSrch;
    let request = gapi.client.youtube.search.list({
      q: q,
      part: 'snippet',
      maxResults: 4
    });
    request.execute(function (response) {
      ant3d.colYTVidIds.length = 0;
      ant3d.colYTVidImgs.length = 0;
      let srchItems = response.result.items;
      $.each(srchItems, function (index, item) {
        console.log(item);
        ant3d.colYTVidIds.push(item.id);
        // I owe you a beer CORS man... XXXOOO  
        ant3d.colYTVidImgs.push('http://cors-anywhere.herokuapp.com/' + item.snippet.thumbnails.default.url);
      });
      ant3d.GenerateObjects();
    });
  },
  getWikiData: function (SearchTerm) {
    $.ajax({
      type: "GET",
      url: 'https://en.wikipedia.org/w/api.php?action=opensearch&search="' + SearchTerm + '"&format=json&callback=?',
      dataType: 'json'
    }).then(function (jsondata, status, jqXHR) {
      ant3d.colHeadings.length = 0;
      ant3d.colArticles.length = 0;
      ant3d.colLinks.length = 0;
      $.each(jsondata[1], function (index, value) {
        ant3d.colHeadings.push(value);
        ant3d.colArticles.push(jsondata[2][index]);
        ant3d.colLinks.push(jsondata[3][index]);
      })
      ant3d.getYouTubeData(SearchTerm);
    });
  },
     //AAN 2018-05-29 FixAPIPass1
  GetGiffys: function (inSrch) {
      //let gkey = "removedforsecurity";
    let offset = Math.floor(Math.random() * 125);
    ant3d.colMovs.length = 0;

    $.ajax({
      url: "https://radiant-beach-90288.herokuapp.com/api/getGF/?title='" + inSrch + "'",
      method: "GET"
    }).then(function (response) {
        response = JSON.parse(response);
        console.log('----------------------->', response);
        ant3d.colGiffys.length = 0;
        for (i = 0; i < response.data.length; i++) {
          let rd = response.data[i];
          let gif = rd.images.looping.mp4;
          ant3d.colGiffys.push(gif);
        }
        ant3d.getWikiData(inSrch);      
      });
  },
  RunVideos: function () {
    if (ant3d.iOS()) {
      //change behavior on iPhone to handle: Apple 'ALL VIDEO FULL SCREEN' decision.
      return;
    }
    let video = document.getElementById('myvideo');
    let video2 = document.getElementById('myvideo2');
    let video3 = document.getElementById('myvideo3');
    let video4 = document.getElementById('myvideo4');
    let video5 = document.getElementById('myvideo5');

    video.loop = true;
    video.play();
    video2.loop = true;
    video2.play();
    video3.loop = true;
    video3.play();
    video4.loop = true;
    video4.play();
    video5.loop = true;
    video5.play();

  },
  Resize: function () {
    ant3d.myheight = window.innerHeight * ant3d.Hcoef;;
    ant3d.mywidth = ant3d.jRightHereBaby.outerWidth() * ant3d.Wcoef;//window.innerWidth * ant3d.Wcoef;
    ant3d.camera = new THREE.PerspectiveCamera(75, (ant3d.mywidth / ant3d.myheight), 0.1, 1000);
    ant3d.renderer.setSize(ant3d.mywidth, ant3d.myheight);
  },
  StartUp: function (inJQueryDomElement, inSrch, inOutCallback) {
    //Code that sets up your initial sceen here
    ant3d.CurGiffy = '';
    ant3d.CurYouTube = '';
    ant3d.ReadText = '';
    
    ant3d.jRightHereBaby = inJQueryDomElement;
    ant3d.colGiffys.length = 0;
    ant3d.rotspeed = 0;
    while (ant3d.scene.children.length > 0) { ant3d.scene.remove(ant3d.scene.children[0]); }
    ant3d.renderer.renderLists.dispose();
    ant3d.scene = new THREE.Scene();
    ant3d.renderer = new THREE.WebGLRenderer();
    ant3d.Resize();
    ant3d.colMovs.length = 0;
    ant3d.colHeadings.length = 0;
    ant3d.colArticles.length = 0;
    ant3d.colLinks.length = 0;
    inJQueryDomElement.empty();
    ant3d.NewTex1 = '';
    ant3d.NewTex2 = '';
    ant3d.NewTex3 = '';
    ant3d.NewTex4 = '';
    ant3d.NewTex5 = '';
    ant3d.NewTex6 = '';
    ant3d.NewTex7 = '';
    ant3d.NewTex8 = '';
    ant3d.NewTex9 = '';
    ant3d.NewTex10 = '';
    ant3d.NewTex11 = '';
    ant3d.NewTex12 = '';
    ant3d.NewTex13 = '';
    ant3d.NewTex14 = '';
    ant3d.NewTex15 = '';
    ant3d.NewTex16 = '';

    ant3d.camera.position.z = 0;
    inJQueryDomElement.append(ant3d.renderer.domElement);
    if (ant3d.bFirstTime) {
      ant3d.callpage = inOutCallback;
      ant3d.bFirstTime = false;

      $('#Pedal').on('click', function(){
        ant3d.Pedal();
      });
      $('#Break').on('click', function(){
        ant3d.Break();
      });
      $('#Coast').on('click', function(){
        ant3d.Coast();
      });
      $('#About').on('click', function(){
        ant3d.About();
      });

      

      $(ant3d.jRightHereBaby).on('dblclick',
        function (e) {
          ant3d.bDblClick = true;
        });
      $(ant3d.jRightHereBaby).on('click', function (e) {
        ant3d.mylastevent = e;
        ant3d.RunVideos();
      });
      $(ant3d.jRightHereBaby).on('touchstart', function (e) {
        ant3d.mylastevent = e;
        ant3d.UpdateMouse(e);
        ant3d.RunVideos();
      });
      $(ant3d.jRightHereBaby).on('touchend', function (e) {
        ant3d.UpdateMouse(e);
        ant3d.DeltaX = ant3d.mylastevent.originalEvent.touches[0].pageX - e.originalEvent.changedTouches[0].pageX;
        ant3d.bFireDetectObjectsUnderMouse = true
        ant3d.mylastevent = e;
        ant3d.rotspeed = ant3d.DeltaX * .0001;
        ant3d.RunVideos();
      });
      $(ant3d.jRightHereBaby).on('mousedown', function (e) {
        ant3d.mylastevent = e;
        ant3d.UpdateMouse(e);
        ant3d.bFireDetectObjectsUnderMouse = true;
        ant3d.RunVideos();
      });
      $(ant3d.jRightHereBaby).on('mouseup', function (e) {
        ant3d.UpdateMouse(e);
        ant3d.DeltaX = ant3d.mylastevent.clientX - e.clientX;
        ant3d.rotspeed = ant3d.DeltaX * .0001;
        ant3d.mylastevent = e;
        ant3d.RunVideos();
      });
    }
    ant3d.GetGiffys(inSrch, ant3d.getWikiData);
  },
  UpdateMouse: function (e) {
    console.log(e);
    
    //let ox = (e.clientX / (window.innerWidth * ant3d.Wcoef)) * 2 - 1;
    //let oy = - (e.clientY / (window.innerHeight * ant3d.Hcoef)) * 2 + 1;
    ant3d.ant3dMouse.x = ((e.clientX) / (window.innerWidth * ant3d.Wcoef)) * 2 - 1;
    ant3d.ant3dMouse.y = - ((e.pageY - $('#the3Dbox').offset().top) / (ant3d.jRightHereBaby.innerHeight() * ant3d.Hcoef)) * 2 + 1;
    
  },
  GetTextArray: function (inMyText, inMyLineLen) {
    //This function wraps text el-manuel aan.
    if(!inMyText){
      inMyText = "Not Found";
    }
    let col = [];
    let wrkwords = inMyText.split(' ');
    let wrkline = '';
    //Split words by space into array
    $.each(wrkwords, function (i, item) {
      let curline = wrkline + ' ' + item;
      //If current line + new word and space is too big. break
      if (curline.length > inMyLineLen) {
        //break line; push to output col
        col.push(wrkline);
        wrkline = item;
      } else {
        //add to line
        wrkline += ' ' + item;
      }
    });
    //Final push
    col.push(wrkline);
    return col;
  },
  GenerateCube: function (name, x, y, z, inTitle, inArticle, inLink) {
    //this code generates a cube, either text or image... atm
    let geometry = new THREE.BoxGeometry(7, 3.5, 1);
    ant3d.tempcanvas = document.createElement("canvas");
    let xc = ant3d.tempcanvas.getContext("2d");
    xc.textBaseline = 'top';
    /// color for background    
    xc.fillStyle = "blue";
    xc.width = xc.height = 128;
    xc.shadowColor = "#000";
    xc.fillRect(0, 0, ant3d.tempcanvas.width, ant3d.tempcanvas.height);
    xc.shadowBlur = 7;
    xc.fillStyle = "white";
    xc.font = "15pt arial bold";
    let ypos = 5;
    $.each(ant3d.GetTextArray(inTitle, 30),
      function (i, item) {
        xc.fillText(item, 5, ypos);
        ypos += 15;
      });
    ypos += 10;
    xc.font = "10pt arial bold";
    $.each(ant3d.GetTextArray(inArticle, ant3d.maxcharacterswide),
      function (i, item) {
        xc.fillText(item, 10, ypos);
        ypos += 12;
      });
    //add map here
    let xm = '';
    let myrnd = Math.floor((Math.random()*22));
    let cubetype = 'unknown';
    let cubetypeid = -1;
    
    switch (true) {
      case myrnd < 1:
        cubetype = 'html5Vid';
        cubetypeid = 1;
        xm = new THREE.MeshBasicMaterial({
          map: ant3d.NewTex1
        });
        xm.map.needsUpdate = true;
        break;
      case myrnd < 2:
        cubetype = 'html5Vid';
        cubetypeid = 2;
        xm = new THREE.MeshBasicMaterial({
          map: ant3d.NewTex2
        });
        xm.map.needsUpdate = true;
        break;
      case myrnd < 3:
        cubetype = 'html5Vid';
        cubetypeid = 3;
        xm = new THREE.MeshBasicMaterial({
          map: ant3d.NewTex3
        });
        xm.map.needsUpdate = true;
        break;
      case myrnd < 4:
        cubetype = 'YouTube';
        cubetypeid = 1;
        xm = new THREE.MeshBasicMaterial({
          map: ant3d.NewTex4
        });
        xm.map.needsUpdate = true;
        break;
      case myrnd < 5:
        cubetype = 'YouTube';
        cubetypeid = 2;
        xm = new THREE.MeshBasicMaterial({
          map: ant3d.NewTex5
        });
        xm.map.needsUpdate = true;
        break;
      case myrnd < 6:
        cubetype = 'YouTube';
        cubetypeid = 3;
        xm = new THREE.MeshBasicMaterial({
          map: ant3d.NewTex6
        });
        
        xm.map.needsUpdate = true;
        break;
      case myrnd < 7:
        cubetype = 'YouTube';
        cubetypeid = 4;
        xm = new THREE.MeshBasicMaterial({
          map: ant3d.NewTex7
        });        
        xm.map.needsUpdate = true;
        break;
      case myrnd < 8:
        cubetype = 'html5Vid';
        cubetypeid = 4;
        xm = new THREE.MeshBasicMaterial({
          map: ant3d.NewTex8
        });
        xm.map.needsUpdate = true;
        break;
      case myrnd < 9:
        cubetype = 'html5Vid';
        cubetypeid = 5;
        xm = new THREE.MeshBasicMaterial({
          map: ant3d.NewTex9
        });
        xm.map.needsUpdate = true;
        break;  
      case myrnd < 10:
        cubetype = 'html5Vid';
        cubetypeid = 6;
        xm = new THREE.MeshBasicMaterial({
          map: ant3d.NewTex10
        });
        xm.map.needsUpdate = true;
        break;
      case myrnd < 11:
        cubetype = 'html5Vid';
        cubetypeid = 7;
        xm = new THREE.MeshBasicMaterial({
          map: ant3d.NewTex11
        });
        xm.map.needsUpdate = true;
        break;        
      case myrnd < 12:
        cubetype = 'html5Vid';
        cubetypeid = 8;
        xm = new THREE.MeshBasicMaterial({
          map: ant3d.NewTex12
        });
        xm.map.needsUpdate = true;
        break;        
      case myrnd < 13:
        cubetype = 'html5Vid';
        cubetypeid = 9;
        xm = new THREE.MeshBasicMaterial({
          map: ant3d.NewTex13
        });
        xm.map.needsUpdate = true;
        break;                
      case myrnd < 14:
        cubetype = 'html5Vid';
        cubetypeid = 10;
        xm = new THREE.MeshBasicMaterial({
          map: ant3d.NewTex14
        });
        xm.map.needsUpdate = true;
        break;               
      case myrnd < 15:
        cubetype = 'html5Vid';
        cubetypeid = 11;
        xm = new THREE.MeshBasicMaterial({
          map: ant3d.NewTex15
        });
        xm.map.needsUpdate = true;
        break;               
      case myrnd <= 16:
        cubetype = 'html5Vid';
        cubetypeid = 12;
        xm = new THREE.MeshBasicMaterial({
          map: ant3d.NewTex16
        });
        xm.map.needsUpdate = true;
        break;                       
      default:
        cubetype = 'Wiki';
        cubetypeid = 0;
        xm = new THREE.MeshBasicMaterial({
          //map: ant3d.NewTex3
          map: new THREE.Texture(ant3d.tempcanvas)
        });
        xm.map.needsUpdate = true;
        break;
    }
    let material = new THREE.MeshFaceMaterial([
      new THREE.MeshBasicMaterial({
        color: 0x1b1b88
        //map: anthead
        //four rot right
      }),
      new THREE.MeshBasicMaterial({
        color: 0x1b1b88
        //two rot right
        // map: anthead
      }),
      new THREE.MeshBasicMaterial({
        color: 0xef6c00//0xeef06e
        //top
        //  map: anthead
      }),
      new THREE.MeshBasicMaterial({
        color: 0xef6c00//0x95970a //bottom
        //map: anthead
      }),
      xm, //Front built external
      new THREE.MeshBasicMaterial({
        color: 0x1919e6   //three rot right
        //map: anthead
      })
    ]);
    //Build cube mesh with geometry and material                                          
    let cube = new THREE.Mesh(geometry, material);
    cube.antName = name;
    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;
    //Store data refs in cube
    cube.MyType = cubetype;
    cube.MyTypeId = cubetypeid;
    cube.MyGiffyLink = ''
    cube.YouTubeId = '';
    cube.Title = '';
    cube.Article = '';
    cube.WikiLink = '';
    switch (cubetype) {
      case 'html5Vid':
        switch (cubetypeid) {
          case 1:
            cube.MyGiffyLink = ant3d.colGiffys[0];
            break;
          case 2:
            cube.MyGiffyLink = ant3d.colGiffys[1];
            break;
          case 3:
            cube.MyGiffyLink = ant3d.colGiffys[2];
            break;
          case 4:
            cube.MyGiffyLink = ant3d.colGiffys[3];
            break;
          case 5:
            cube.MyGiffyLink = ant3d.colGiffys[4];
            break;          
          case 6:
            cube.MyGiffyLink = ant3d.colGiffys[0];
            break;
          case 7:
            cube.MyGiffyLink = ant3d.colGiffys[1];
            break;
          case 8:
            cube.MyGiffyLink = ant3d.colGiffys[2];
            break;
          case 9:
            cube.MyGiffyLink = ant3d.colGiffys[3];
            break;
          case 10:
            cube.MyGiffyLink = ant3d.colGiffys[4];
            break;
          case 11:
            cube.MyGiffyLink = ant3d.colGiffys[0];
            break;
          case 12:
            cube.MyGiffyLink = ant3d.colGiffys[1];
            break;
          case 13:
            cube.MyGiffyLink = ant3d.colGiffys[2];
            break;
          case 14:
            cube.MyGiffyLink = ant3d.colGiffys[3];
            break;
          case 15:
            cube.MyGiffyLink = ant3d.colGiffys[4];
            break;
          case 16:
            cube.MyGiffyLink = ant3d.colGiffys[0];
            break;
        };
        break;
      case 'YouTube':
        switch (cubetypeid) {
          case 1:
            cube.YouTubeId = ant3d.colYTVidIds[0];
            break;
          case 2:
            cube.YouTubeId = ant3d.colYTVidIds[1];
            break;
          case 3:
            cube.YouTubeId = ant3d.colYTVidIds[2];
            break;
          case 4:
            cube.YouTubeId = ant3d.colYTVidIds[3];
            break;
        };
        break;
      case 'Wiki':
        cube.Title = inTitle;
        cube.Article = inArticle;
        cube.WikiLink = inLink;
        break;
    }
    return cube;
  },
  Videos: [],
  GenerateObjects() {
    //Generate 3 rows of 10 cubes
    let cubx = 0;
    let cuby = 0;
    let cubz = -12;
    let angle = 0
    THREE.ImageUtils.crossOrigin = 'anonymous';
    let video = document.getElementById('myvideo');
    video.setAttribute('crossorigin', 'anonymous');
    let video2 = document.getElementById('myvideo2');
    video2.setAttribute('crossorigin', 'anonymous');
    let video3 = document.getElementById('myvideo3');
    video3.setAttribute('crossorigin', 'anonymous');
    let video4 = document.getElementById('myvideo4');
    video4.setAttribute('crossorigin', 'anonymous');
    let video5 = document.getElementById('myvideo5');
    video5.setAttribute('crossorigin', 'anonymous');
    video.src = ant3d.colGiffys[0];
    video2.src = ant3d.colGiffys[1];
    video3.src = ant3d.colGiffys[2];
    video4.src = ant3d.colGiffys[3];
    video5.src = ant3d.colGiffys[4];
    video.load();
    //video.addEventListener('loadeddata', function () {
    video2.load();
    //  video2.addEventListener('loadeddata', function () {
    video3.load();
    //    video3.addEventListener('loadeddata', function () {
    //ant 2018.04.04 expand giffy by 2 * etc..
    video4.load();
    video5.load();
    video.loop = true;
    video.play();
    video2.loop = true;
    video2.play();
    video3.loop = true;
    video3.play();
    video4.loop = true;
    video4.play();
    video5.loop = true;
    video5.play();
    //

    let texture1 = new THREE.VideoTexture(video);
    texture1.minFilter = THREE.LinearFilter;
    texture1.magFilter = THREE.LinearFilter;
    texture1.format = THREE.RGBFormat;
    texture1.needsUpdate = true;
    let texture2 = new THREE.VideoTexture(video2);
    texture2.minFilter = THREE.LinearFilter;
    texture2.magFilter = THREE.LinearFilter;
    texture2.format = THREE.RGBFormat;
    texture2.needsUpdate = true;
    let texture3 = new THREE.VideoTexture(video3);
    texture3.minFilter = THREE.LinearFilter;
    texture3.magFilter = THREE.LinearFilter;
    texture3.format = THREE.RGBFormat;
    texture3.needsUpdate = true;
//--carefull here... ant. 04/04/2018
    

    let texture8 = new THREE.VideoTexture(video4);
    texture8.minFilter = THREE.LinearFilter;
    texture8.magFilter = THREE.LinearFilter;
    texture8.format = THREE.RGBFormat;
    texture8.needsUpdate = true;

    let texture9 = new THREE.VideoTexture(video5);
    texture9.minFilter = THREE.LinearFilter;
    texture9.magFilter = THREE.LinearFilter;
    texture9.format = THREE.RGBFormat;
    texture9.needsUpdate = true;

//--carefull here... ant. 04/04/2018
    let texture4 = THREE.ImageUtils.loadTexture(ant3d.colYTVidImgs[0]);
    let texture5 = THREE.ImageUtils.loadTexture(ant3d.colYTVidImgs[1]);
    let texture6 = THREE.ImageUtils.loadTexture(ant3d.colYTVidImgs[2]);
    let texture7 = THREE.ImageUtils.loadTexture(ant3d.colYTVidImgs[3]);
   
    ant3d.NewTex1 = texture1
    ant3d.NewTex2 = texture2
    ant3d.NewTex3 = texture3
    ant3d.NewTex4 = texture4
    ant3d.NewTex5 = texture5
    ant3d.NewTex6 = texture6
    ant3d.NewTex7 = texture7
    ant3d.NewTex8 = texture8
    ant3d.NewTex9 = texture9
    ant3d.NewTex10 = texture1
    ant3d.NewTex11 = texture2
    ant3d.NewTex12 = texture3
    ant3d.NewTex13 = texture8
    ant3d.NewTex14 = texture9
    ant3d.NewTex15 = texture1
    ant3d.NewTex16 = texture2
    
    let artid = 0;
    for (let i = 0; i < 10; i++) {
      // Video is loaded and can be played
       
      let myTitle = ant3d.colHeadings[artid];
      let myArticle = ant3d.colArticles[artid];
      let myLink = ant3d.colLinks[artid];
      if (artid < ant3d.colHeadings.length - 1) { artid++ }else{artid = 0 };
      cuby = -4;
      let xz = ant3d.rotate(0, 0, cubx, cubz, ((360 / 10) * i));
      let cubeA = ant3d.GenerateCube('cubeA' + i, xz[0], cuby, xz[1], myTitle, myArticle, myLink);
      myTitle = ant3d.colHeadings[artid];
      myArticle = ant3d.colArticles[artid];
      myLink = ant3d.colLinks[artid];
      if (artid < 9) { artid++ };
      cuby = 0;
      xy = ant3d.rotate(0, 0, cuby, cubx, ((360 / 10) * i));
      let cubeB = ant3d.GenerateCube('cubeB' + i, xz[0], cuby, xz[1], myTitle, myArticle, myLink);
      myTitle = ant3d.colHeadings[artid];
      myArticle = ant3d.colArticles[artid];
      myLink = ant3d.colLinks[artid];
      if (artid < 9) { artid++ };
      cuby = 4;
      xy = ant3d.rotate(0, 0, cuby, cubx, ((360 / 10) * i));
      let cubeC = ant3d.GenerateCube('cubeC' + i, xz[0], cuby, xz[1], myTitle, myArticle, myLink);
      ant3d.scene.add(cubeA, cubeB, cubeC);
    }
    requestAnimationFrame(ant3d.Animate);
    //      }, false);
    //    }, false);
    //  }, false);
    return;
  },
  clearThreeObj: function (obj) {
    //Code from internet to recurse clear objects.
    while (obj.children.length > 0) {
      ant3d.clearThreeObj(obj.children[0]);
      obj.remove(obj.children[0]);
    }
    if (obj.geometry) obj.geometry.dispose();
    //Code corrected for objects.
    if (obj.Mesh) obj.Mesh.dispose();
    if (obj.texture) obj.texture.dispose();
  },
  Animate: function () {
    //Code that runs every frame goes here
    let graObj = ant3d.antDetectObjectsUnderMouse();
    if (graObj[0]) {
      if (ant3d.bDblClick === true) {
        console.log('graObj');
        console.log(graObj[0].object);
        ant3d.CurGiffy = graObj[0].object.MyGiffyLink;
        ant3d.CurYouTube = graObj[0].object.YouTubeId.videoId;
        //ant3d.ReadText = graObj[0].object.Title + ' ' + graObj[0].object.Article;
        ant3d.ReadText = graObj[0].object.Article;
        setTimeout(function () {
          ant3d.callpage(ant3d.CurGiffy, ant3d.CurYouTube, ant3d.ReadText);
        }, 1);
        ant3d.bDblClick = false;
      }
    };
    ant3d.scene.rotation.y += ant3d.rotspeed;
    $.each(ant3d.scene.children, function (i, item) {
      item.rotation.y += -ant3d.rotspeed;
    });
    ant3d.renderer.render(ant3d.scene, ant3d.camera);
    ant3d.rotspeed = ant3d.rotspeed * ant3d.friction;
    requestAnimationFrame(ant3d.Animate);
  },
  rotate: function (cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
      ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
  },
  iOS: function () {
    var iDevices = [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ];
    if (!!navigator.platform) {
      while (iDevices.length) {
        if (navigator.platform === iDevices.pop()) { return true; }
      }
    }
    return false;
  }
}
$(document).ready(function () {
  ant3d.StartUp($("#rightherebaby"), 'Programming', displayFrom3D);
  $(window).on('resize', function () { ant3d.Resize(); });
  $('#search').on('click', function () {
    //calling ant3d.Startup example...
    //ant3d.StartUp(jQueryDomElement, SearchText);   
    ant3d.StartUp($("#rightherebaby"), $('#input').val(), displayFrom3D);
    $('#input').val('');
  });
  $('#input').on('keyup', function (e) {
    if (e.key === 'Enter') {
      ant3d.StartUp($("#rightherebaby"), $('#input').val(), displayFrom3D);
      $('#input').val('');
    }
  });
});
var int3d = ant3d;