document.addEventListener('DOMContentLoaded', function () {
    //setTimeout(function() {main();},10000);
    console.log("yippee");

    /*< !--Start the webcam stream and attach it to the video element-- >
        //<script>

            // You can also set which camera to use (front/back/etc)
            // @SEE https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
            navigator.mediaDevices.getUserMedia({audio: false, video: true })
            .then(stream => {
                let $video = document.querySelector('video')
            $video.srcObject = stream
                $video.onloadedmetadata = () => {
                $video.play()
            }
            })
    //</script>
    */
    //return;
    main();
});

function main() {
    //////////////////////////////////////////////////////////////////////////////////
    //		Init
    //////////////////////////////////////////////////////////////////////////////////
    // commonjs
    //var THREE = window.THREE = require('three');
    //require('three/examples/js/loaders/GLTFLoader');

    //setTimeout(function () {     debugger; }, 300);
    //debugger;

    // init renderer
    console.log("Initialize Renderer");
    var renderer = new THREE.WebGLRenderer({
        //canvas: thatCanvas,
        // antialias	: true,
        alpha: true,

        depth: false,
        stencil: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: true
    });
    //_depth = parameters.depth !== undefined ? parameters.depth : true,
    //_stencil = parameters.stencil !== undefined ? parameters.stencil : true,
    //_antialias = parameters.antialias !== undefined ? parameters.antialias : false,
    //_premultipliedAlpha = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true,
    //_preserveDrawingBuffer = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false;

    // renderer.shadowMap.type = THREE.BasicShadowMap
    // renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.enabled = true;

    renderer.setClearColor(new THREE.Color('lightgrey'), 0);
    // renderer.setPixelRatio( 1/2 );

    var canvasdiv = document.getElementById("canvasDiv");

    var j = 0;
    for (i = 0; i < 10000; i++)
        j++;

    console.log("width ", window.innerWidth, " height ", window.innerHeight);
    var arWindowWidth = window.innerWidth;
    var arWindowHeight = 256;

    window.innerHeight = arWindowHeight;
    renderer.setSize(window.innerWidth*0.7, window.innerHeight);
    console.log("width = " + window.innerWidth + " height = " + window.innerHeight);
  //  renderer.domElement.style.position = 'absolute'
  //  renderer.domElement.style.top = '100px'
  //  renderer.domElement.style.left = '0px'
  renderer.domElement.style.overflow = 'hidden';
   //  document.body.appendChild(renderer.domElement);
    //renderer.domElement.zIndex = '1000';
   canvasdiv.appendChild(renderer.domElement);
    var clientRect = renderer.domElement.getBoundingClientRect();

    var objSelected = false;
    renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
    renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
    renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
    renderer.domElement.addEventListener('mouseleave', onDocumentMouseLeave, false);
    //_domElement.addEventListener('touchmove', onDocumentTouchMove, false);
    //_domElement.addEventListener('touchstart', onDocumentTouchStart, false);
    //_domElement.addEventListener('touchend', onDocumentTouchEnd, false);

    // raycaster for selecting objects
    var _raycaster = new THREE.Raycaster();
    var _mouse = new THREE.Vector2();
    var _objects = [];
    var _bud;
    var myPos = new THREE.Vector3();

    // array of functions for the rendering loop
    var onRenderFcts = [];

    // init scene and camera
    var _scene = new THREE.Scene();

    var ambient = new THREE.AmbientLight(0x666666);
    _scene.add(ambient);

    var directionalLight = new THREE.DirectionalLight('white');
    directionalLight.position.set(1, 2, 0.3).setLength(2)
    directionalLight.shadow.mapSize.set(128, 128)
    directionalLight.shadow.camera.bottom = -0.6
    directionalLight.shadow.camera.top = 0.6
    directionalLight.shadow.camera.right = 0.6
    directionalLight.shadow.camera.left = -0.6
    directionalLight.castShadow = true;
    // scene.add(new THREE.CameraHelper( directionalLight.shadow.camera ))
    _scene.add(directionalLight);

    //////////////////////////////////////////////////////////////////////////////////
    //		Initialize a basic camera
    //////////////////////////////////////////////////////////////////////////////////

    // Create a camera
    //var _camera = new THREE.Camera();
    //w var _camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 500);
    var _camera = new THREE.PerspectiveCamera(70, 100 / 48, 0.1, 500);
    _scene.add(_camera);

    ////////////////////////////////////////////////////////////////////////////////
    //          handle arToolkitSource
    ////////////////////////////////////////////////////////////////////////////////

    var arToolkitSource = new THREEx.ArToolkitSource({
        // to read from the webcam
         sourceType: 'webcam',

        // to read from an image
        // sourceType : 'image',
        // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',
        // sourceUrl : './data/img.jpg',

        // to read from a video
        // sourceType : 'video',
        // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',
        // sourceUrl : '../data/headtracking.mp4',
    })

    arToolkitSource.init(function onReady() {
        onResize()
    })

    // handle resize
    window.addEventListener('resize', function () {
        onResize()
    })
    function onResize() {
        arToolkitSource.onResize()
        arToolkitSource.copySizeTo(renderer.domElement)
        if (arToolkitContext.arController !== null) {
            arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)
            //arToolkitSource.copySizeTo(thatCanvas)
        }
    }
    ////////////////////////////////////////////////////////////////////////////////
    //          initialize arToolkitContext
    ////////////////////////////////////////////////////////////////////////////////


    // create atToolkitContext
    var arToolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: './data/camera_para.dat',
        detectionMode: 'mono',
        // maxDetectionRate: 30,
        // canvasWidth: 80*3,
        // canvasHeight: 60*3,
    })
    // initialize it
    arToolkitContext.init(function onCompleted() {
        // copy projection matrix to camera
        _camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    })

    //bw keep track if object is to be shown
    var productsVisible = 0;

    // update artoolkit on every frame
    onRenderFcts.push(function () {
        if (arToolkitSource.ready === false) return

        arToolkitContext.update(arToolkitSource.domElement)
        //arToolkitContext.update(thatCanvas);

        // update scene.visible if the marker is seen
        if (productsVisible == 0)
            _scene.visible = _camera.visible

        if (_camera.visible && !productsVisible) {
            console.log("products set to visible");
            productsVisible = 1;
        }
    })


    ////////////////////////////////////////////////////////////////////////////////
    //          Create a ArMarkerControls
    ////////////////////////////////////////////////////////////////////////////////

    var markerControls = new THREEx.ArMarkerControls(arToolkitContext, _camera, {
        type: 'pattern',
        // patternUrl: './patt.hiro',
        patternUrl: './vm2.patt',
        // patternUrl: './data/vm2.patt',
        // patternUrl: THREEx.ArToolkitContext.baseURL + './assets/data/patt.hiro',
        // bwadd patternUrl: THREEx.ArToolkitContext.baseURL + '../data/data/patt.hiro',
        // patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
        // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
        changeMatrixMode: 'cameraTransformMatrix'
    })
    // as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
    _scene.visible = false

    //////////////////////////////////////////////////////////////////////////////////
    //		add an object in the scene
    //////////////////////////////////////////////////////////////////////////////////

    var groupProductsParent = new THREE.Group
    var groupProducts = new THREE.Group
    var markerRoot = new THREE.Group
    _scene.add(markerRoot)

        // add a torus knot
        // var geometry	= new THREE.CubeGeometry(1,1,1);
        // var material	= new THREE.MeshNormalMaterial({
        // 	transparent : true,
        // 	opacity: 0.5,
        // 	side: THREE.DoubleSide
        // });
        // var mesh	= new THREE.Mesh( geometry, material );
        // mesh.position.y	= geometry.parameters.height/2
        // markerRoot.add( mesh );

        ; (function () {
/*            var myScale = 1.0;
            var geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16); // make it slightly larger for better view
            var material = new THREE.MeshNormalMaterial();
            var material = new THREE.MeshLambertMaterial();
            var mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.position.y = -0.15
            mesh.scale.x = myScale;
            mesh.scale.y = myScale;
            mesh.scale.z = myScale;
            var ob = new THREE.Object3D();
            mesh.name = "Weed Bud";
            _bud = mesh;
            ob.add(mesh);
            ob.userData = { objName: "Weed Bud" };
            groupProducts.add(ob);
            _objects.push(ob);
            //markerRoot.add(mesh);
            // point the directionalLight to the marker
            directionalLight.target = mesh

            onRenderFcts.push(function () {
                mesh.rotation.x += 0.04;
            })

            geometry = new THREE.ConeGeometry(0.3, 0.5, 8);
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = 1.2;
            mesh.position.y = -0.15;
            mesh.scale.x = myScale;
            mesh.scale.y = myScale;
            mesh.scale.z = myScale;
            var ob = new THREE.Object3D();
            _bud = mesh;
            ob.add(mesh);
            ob.userData = { objName: "Milk Chocolate Bar" };
            groupProducts.add(ob);
            _objects.push(ob);
            //markerRoot.add(mesh);

            geometry = new THREE.IcosahedronGeometry(0.3, 0);
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = -1.0;
            mesh.position.y = -0.15;
            mesh.scale.x = myScale;
            mesh.scale.y = myScale;
            mesh.scale.z = myScale;
            var ob = new THREE.Object3D();
            _bud = mesh;
            ob.add(mesh);
            ob.userData = { objName: "White Chocolate Bar" };
            groupProducts.add(ob);
            _objects.push(ob);
            //markerRoot.add(mesh);

            var points = [];
            for ( var i = 0; i < 10; i ++ ) {
                points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 10 + 5, ( i - 5 ) * 2 ) );
            }
            var geometry = new THREE.LatheGeometry( points );            geometry = new THREE.ConeGeometry(0.3, 0.5, 8);
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = -2.2;
            mesh.position.y = -0.15;
            mesh.scale.x = myScale;
            mesh.scale.y = myScale;
            mesh.scale.z = myScale;
            var ob = new THREE.Object3D();
            _bud = mesh;
            ob.add(mesh);
            ob.userData = { objName: "Gummy Bears" };
            groupProducts.add(ob);
            _objects.push(ob);
            //markerRoot.add(mesh);

            geometry = new THREE.TorusGeometry(0.3, 0.05, 8, 50);
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = 2.75;
            mesh.position.y = -0.15;
            mesh.scale.x = myScale;
            mesh.scale.y = myScale;
            mesh.scale.z = myScale;
            var ob = new THREE.Object3D();
            _bud = mesh;
            ob.add(mesh);
            ob.userData = { objName: "Infused Coconut Oil" };
            groupProducts.add(ob);
            _objects.push(ob);
            //markerRoot.add(mesh);
*/
            
            // X: right y:out of screen z: down
            var loader = new THREE.GLTF2Loader();
            console.log("Loading Milk Chocolate Bar");
//            loader.load('data/models/chocolatebar/MilkChocolate2.glb', function (gltf) {
              loader.load('data/models/chocolatebar/MilkChocolate.gltf', function (gltf) {
//            loader.load('data/models/chocolatebar/myBox.gltf', function (gltf) {
                var ii = 0;
                console.log(gltf.scene);
                var ob = gltf.scene.getObjectByName("Box001");
                console.log(ob);
                ob.position.x = 1.2;
                ob.position.y = -0.15;
                //ob.position.z = .5;
                ob.scale.x = 0.025;
                ob.scale.y = 0.025;
                ob.scale.z = 0.025;
                var ch = ob.children[0];
                //markerRoot.add(ob);
                //ob.userData = { objId: 1000};

                //_bud = ob;
                //_bud.getWorldPosition(myPos);

                ob.userData = { objName: "Milk Chocolate Bar" };
                groupProducts.add(ob);
                _objects.push(ob);
                var tt = 0;
                //markerRoot.add(mesh2);
                //scene.add(gltf.scene);
            }, undefined, function (error) {
                console.log("error loading chocolate bar");
                console.error(error);
            });

            //loader.load('data/models/chocolatebar/WhiteChocolate.gltf', function (gltf) {
            loader.load('data/models/chocolatebar/WhiteChocolate.gltf', function (gltf) {
                var ii = 0;
                //var mesh2 = new THREE.Mesh(gltf.scene, material);
                //gltf.scene.position.y = 0.7;
                console.log(gltf.scene);
                var ob = gltf.scene.getObjectByName("Box001");
                console.log(ob);
                ob.position.x = -1.0;
                ob.position.y = 0.15;
                ob.scale.x = 0.025;
                ob.scale.y = 0.025;
                ob.scale.z = 0.025;
                var ch = ob.children[0];
                //ob.userData = { objId: 1001 };
                ob.userData = { objName: "White Chocolate Bar" }; 
                //markerRoot.add(ob);
                groupProducts.add(ob);
                _objects.push(ob);
                var tt = 0;
            }, undefined, function (error) {
                console.error(error);
            });

            loader.load('data/models/weedbud/weedbud.gltf', function (gltf) {
                var ii = 0;
                console.log(gltf.scene);
                var ob = gltf.scene.getObjectByName("Group38207");
                console.log(ob);
                //ob.position.x = -0.5;
                //ob.position.y = 0.15;
                ob.scale.x = 0.025;
                ob.scale.y = 0.025;
                ob.scale.z = 0.025;
                var ch = ob.children[0];
                //markerRoot.add(ob);
                //ob.userData = { objId: 1002 };
                ob.userData = { objName: "Weed Bud" };
                _bud = ob;
                var p;
                _bud.getWorldPosition(myPos);
                console.log("budPos =", myPos)
                groupProducts.add(ob);
                _objects.push(ob);
                var tt = 0;
            }, undefined, function (error) {
                console.error(error);
            });

            loader.load('data/models/redgummybear/gummybears.gltf', function (gltf) {
                var ii = 0;
                var groupGummy = new THREE.Group;
                console.log(gltf.scene);
                var ob = gltf.scene.getObjectByName("gummy_bear_red");
                //ob.userData = { objId: 1003 };
                ob.userData = { objName: "Gummy Bears" };
                groupGummy.add(ob);
                _objects.push(ob);
                //markerRoot.add(ob);
                var tt = 0;
                var ob = gltf.scene.getObjectByName("gummy_bear_blue");
                //ob.userData = { objId: 1003 };
                ob.userData = { objName: "Gummy Bears" };
                groupGummy.add(ob);
                _objects.push(ob);
                //markerRoot.add(ob);
                var tt = 0;
                var ob = gltf.scene.getObjectByName("gummy_bear_yellow");
                //ob.userData = { objId: 1003 };
                ob.userData = { objName: "Gummy Bears" };
                groupGummy.add(ob);
                _objects.push(ob);
                //markerRoot.add(ob);
                var tt = 0;
                var ob = gltf.scene.getObjectByName("gummy_bear_green");
                //ob.userData = { objId: 1003 };
                ob.userData = { objName: "Gummy Bears" };
                console.log(ob);
                groupGummy.add(ob);
                _objects.push(ob);
                //markerRoot.add(ob);
                var tt = 0;
                groupGummy.position.x = -2.2;
                groupGummy.position.y = 0.35;
                groupGummy.scale.x = 0.25;
                groupGummy.scale.y = 0.25;
                groupGummy.scale.z = 0.25;

                //markerRoot.add(groupGummy);
                groupProducts.add(groupGummy);
            }, undefined, function (error) {
                console.error(error);
            });

            loader.load('data/models/coconutoil/coconutoil2.gltf', function (gltf) {
                var ii = 0;
                console.log(gltf.scene);
                var groupOilJar = new THREE.Group
                var ob = gltf.scene.getObjectByName("Label");
                console.log(ob);
                ob.scale.x = 0.2;
                ob.scale.y = 0.2;
                ob.scale.z = 0.2;
                var ch = ob.children[0];
                //ob.userData = { objId: 1004 };
                ob.userData = { objName: "Infused Coconut Oil" };
                //markerRoot.add(ob);
                groupOilJar.add(ob);
                _objects.push(ob);
                ob = gltf.scene.getObjectByName("Bottle");
                console.log(ob);
                ob.scale.x = 0.192;
                ob.scale.y = 0.192;
                ob.scale.z = 0.192;
                ch = ob.children[0];
                groupOilJar.add(ob);
                _objects.push(ob);
                groupOilJar.position.x = 2.75;
                groupOilJar.position.y = 0.7;
                groupOilJar.position.z = 0.7;
                //markerRoot.add(ob);
                groupProducts.add(groupOilJar);
                var tt = 0;
            }, undefined, function (error) {
                console.error(error);
            });

            groupProductsParent.add(groupProducts);
            markerRoot.add(groupProductsParent);

            // add a transparent ground-plane shadow-receiver
            var material = new THREE.ShadowMaterial();
            material.opacity = 0.7; //! bug in threejs. can't set in constructor

            var geometry = new THREE.PlaneGeometry(3, 3)
            var planeMesh = new THREE.Mesh(geometry, material);
            planeMesh.receiveShadow = true;
            planeMesh.depthWrite = false;
            planeMesh.rotation.x = -Math.PI / 2;
            markerRoot.add(planeMesh);
        })()



    //////////////////////////////////////////////////////////////////////////////////
    //		render the whole thing on the page
    //////////////////////////////////////////////////////////////////////////////////
/*    var stats = new Stats();
    document.body.appendChild(stats.dom);
*/
/*
    var newDiv = document.createElement("div");
    // and give it some content 
    var newContent = document.createTextNode("Hi there and greetings!");
    // add the text node to the newly created div
    newDiv.appendChild(newContent);

    var btnDiv = document.createElement("div");
    var newBtn = document.createElement("button");
    newBtn.setAttribute("width", "100%");
    newBtn.setAttribute("height", "150px");
    btnDiv.appendChild(newBtn);
    //document.body.appendChild(btnDiv);
    document.body.appendChild(newBtn);

    document.body.insertBefore(newDiv, btnDiv);
*/

    // render the scene
    onRenderFcts.push(function () {
        renderer.render(_scene, _camera);
        //stats.update();
    })

    // run the rendering loop
    var lastTimeMsec = null
    var lastProductsVisible = false;
    var lastProductsPos = new THREE.Vector3(0,0,0);
    var productsVec = new THREE.Vector3(0, 0, 0);
    var cameraPos = new THREE.Vector3(0,0,0);
    requestAnimationFrame(function animate(nowMsec) {
        if (lastProductsVisible == true) {
            // get camera params and set products in correct location
            _camera.getWorldPosition(cameraPos);
            groupProductsParent.position.x = cameraPos.x + productsVec.x;
            groupProductsParent.position.y = cameraPos.y + productsVec.y;
            groupProductsParent.position.z = cameraPos.z + productsVec.z;
        }
        else if (lastProductsVisible == false && productsVisible == true) {
            lastProductsVisible = true;
            // get camera params and save
            var productsPos = new THREE.Vector3(0, 0, 0);
            _camera.getWorldPosition(cameraPos);
            groupProductsParent.getWorldPosition(productsPos);
            //productsVec.x = productsPos.x - cameraPos.x;
            //productsVec.y = productsPos.y - cameraPos.y;
            //productsVec.z = productsPos.z - cameraPos.z;
            //console.log(productsVec);
            productsVec.x = 0.0;
            productsVec.y = -5.0;
            productsVec.z = 1.0;
        }

        // keep looping
        requestAnimationFrame(animate);
        // measure time
        lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
        var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
        lastTimeMsec = nowMsec
        // call each update function
        onRenderFcts.forEach(function (onRenderFct) {
            onRenderFct(deltaMsec / 1000, nowMsec / 1000)
        })
    })

    var mouseDownPos = new THREE.Vector2();
    var mouseVec = new THREE.Vector2();

    function onDocumentMouseMove(event) {

        event.preventDefault();

        _mouse.x = ((event.clientX - clientRect.left) / clientRect.width) * 2 - 1;
        _mouse.y = - ((event.clientY - clientRect.top) / clientRect.height) * 2 + 1;

    }

    function onDocumentMouseDown(event) {
        var ijk = 0;
        event.preventDefault();

        renderer.domElement.style.cursor = 'move';

        mouseDownPos.x = ((event.clientX - clientRect.left) / clientRect.width) * 2 - 1;
        mouseDownPos.y = - ((event.clientY - clientRect.top) / clientRect.height) * 2 + 1;

        _mouse.x = _mouse.x * 1.0;
        //_raycaster.setFromCamera(_mouse, _camera);
        //_raycaster.set(origin, direction)
        var origin = new THREE.Vector3(0.30, -5.0, 1.0);
        var direction = new THREE.Vector3(0.0, 1.0, 0.0);
        var angle = mouseDownPos.x * 35 * 1.57 / 90;
        direction.x = Math.tan(angle);
        var bott = direction.x * direction.x + 1;
        direction.y = direction.y / bott;
        //direction.normalize();
        _raycaster.set(origin, direction);

        //console.log("raycast pos = ", _raycaster.ray.origin.x, ",", _raycaster.ray.origin.y, ",", _raycaster.ray.origin.z, " dir = ", _raycaster.ray.direction.x, ",", _raycaster.ray.direction.y, ",", _raycaster.ray.direction.z);
        _camera.getWorldPosition(cameraPos);
        //console.log("cameraPos = ", cameraPos.x.toPrecision(3), ",", cameraPos.y.toPrecision(3), ",", cameraPos.z.toPrecision(3));
        console.log("mousePos = ", mouseDownPos.x.toPrecision(3), ",", mouseDownPos.y.toPrecision(3));

        console.log("raycast posss = ", _raycaster.ray.origin.x.toPrecision(3), ",", _raycaster.ray.origin.y.toPrecision(3), ",", _raycaster.ray.origin.z.toPrecision(3), " dir = ", _raycaster.ray.direction.x.toPrecision(3), ",", _raycaster.ray.direction.y.toPrecision(3), ",", _raycaster.ray.direction.z.toPrecision(3));

        var intersects = _raycaster.intersectObjects(_objects, true);

        if (intersects.length > 0) {
            console.log("intersected objects len = ", intersects.length);

            var object = intersects[0].object.parent;
            //var objId = object.userData.myId;
            var objName = object.userData.objName;        

            if (objName === undefined)
                console.log("intersected object id = unknown");
            else {
                //console.log("intersected object id = ", objId);
                console.log("intersected object name = ", objName);
                var theBtn = document.getElementById("infoBtn");
                theBtn.innerHTML = objName;
            }

            /*           _plane.setFromNormalAndCoplanarPoint(_camera.getWorldDirection(_plane.normal), _worldPosition.setFromMatrixPosition(object.matrixWorld));
           
                       if (_hovered !== object) {
           
                           scope.dispatchEvent({ type: 'hoveron', object: object });
           
                           _domElement.style.cursor = 'pointer';
                           _hovered = object;
           
                       }
           */
        }
 /*       else {

            if (_hovered !== null) {

                scope.dispatchEvent({ type: 'hoveroff', object: _hovered });

                _domElement.style.cursor = 'auto';
                _hovered = null;

            }
        }
*/
    }

    function onDocumentMouseUp(event) {
        event.preventDefault();

        //renderer.domElement.style.cursor = _hovered ? 'pointer' : 'auto';
        renderer.domElement.style.cursor = 'auto';

        var mousePos = new THREE.Vector2();
        mousePos.x = ((event.clientX - clientRect.left) / clientRect.width) * 2 - 1;
        mousePos.y = - ((event.clientY - clientRect.top) / clientRect.height) * 2 + 1;

        // calculate translation
        var transX = mousePos.x - mouseDownPos.x;
        var transY = mousePos.y - mouseDownPos.y;
        //console.log(transX);
        if (productsVisible) {
            groupProducts.position.x += transX;
            groupProducts.position.z -= transY;

            _bud.getWorldPosition(myPos);
            console.log("budPos =", myPos);
        }
    }

    function onDocumentMouseLeave(event) {
        event.preventDefault();

    }

}