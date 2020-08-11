import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

// this is to address back button issue
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
// this is end of address back button issue

import { GlobalService } from '../providers/global-service';
import { ProductService, Product } from '../providers/product-service';
import { CartItemService, CartItem } from '../providers/cart-service';

//import * as THREE from "../../assets/lib/three";
import * as THREE from "three";
//import GLTFLoader from "three-gltf-loader";
//import GLTF2Loader from "three-gltf2-loader";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { AngularDelegate } from '@ionic/angular';
//import GLTF2Loader from '../../assets/lib/GLTF2Loader';
//import { OrbitControls } from '../../assets/lib/OrbitControls.js';

import jsQR, { QRCode } from 'jsqr';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  userName: string = "";
  loggedIn: boolean = false;

  products: Product[];
  ci: CartItem;
  qtyItems: number;
  
  arToggle: boolean = false;
  flowersToggle: boolean = true;
  ediblesToggle: boolean = true;
  extractsToggle: boolean = true;
  accessoriesToggle: boolean = true;
  pawsToggle: boolean = true;

  scanWindowStatus: number = 0;
  scanStatus: string = "Scan QR Code";
  bShowScanWindow: boolean = false;

  canvasElement: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;
  ////outputContainer: HTMLDivElement;
  ////outputMessage: HTMLDivElement;
  ////outputData: HTMLDivElement;
  videoDivElement: HTMLDivElement;
  video: HTMLVideoElement;

  qrcodeDetected: string;
  bScannedData: boolean = false;

  bPlatformReady: boolean = false;

  scanText: string;
  newText: string;
  strErrCode: string;
  _scanWindowWidth: number = 406;
  _scanWindowHeight: number = 252;
  _scanWindowImage: HTMLDivElement; 

  _bShow3d: boolean = true;
  _b3dProducts: boolean = true;

  _scene: THREE.Scene;
  _camera: THREE.PerspectiveCamera;
  _camPosDefault: THREE.Vector3 = new THREE.Vector3(0,0,8);
  _camPosProduct: THREE.Vector3 = new THREE.Vector3(0,0,2.5);
  _renderer: THREE.WebGLRenderer;
  _container: any;
  _controls: any;

  _raycaster: THREE.Raycaster;  
  _intersects: any[] = new Array(10);

  _mouse: THREE.Vector2;
  _objects: THREE.Object3D[] = [];
  _bud: THREE.Object3D;
  _myPos: THREE.Vector3;

  _groupProductsParent: THREE.Group;
  _groupProducts: THREE.Group;
  _markerRoot: THREE.Group;

  _bShowStoreName: boolean = false;
  _bStoreSprite: boolean = false;
  _spriteStoreName: THREE.Sprite;
  _meshStoreName: THREE.Mesh;

  _groupSprites: THREE.Group;
  _spriteX: THREE.Sprite;
  _camDir: THREE.Vector3;
  _camRight: THREE.Vector3;
  _camUp: THREE.Vector3;
  _spriteMilkChocolate: THREE.Sprite;
  _spriteWhiteChocolate: THREE.Sprite;
  _spriteBuds01: THREE.Sprite;
  _spriteBuds03: THREE.Sprite;
  _spriteGummyBears: THREE.Sprite;
  _spriteCoconutOil: THREE.Sprite;
  _spriteDogTreat: THREE.Sprite;
  //_spriteRedGummyBear: THREE.Sprite;
  //_spriteWaterPipe: THREE.Sprite;

  _meshVendingMachine: THREE.Object3D;
  _meshMilkChocolate: THREE.Object3D;
  _meshWhiteChocolate: THREE.Object3D;
  _meshBuds01: THREE.Object3D;
  _meshBuds03: THREE.Object3D;
  _meshGummyBears: THREE.Object3D;
  _meshCoconutOil: THREE.Object3D;
  _meshDogTreat: THREE.Object3D;
  //_meshRedGummyBear: THREE.Object3D;
  //_meshWaterPipe: THREE.Object3D;

  constructor(/*private platform: Platform,*/public globalService: GlobalService,
    public cartItemService: CartItemService,  
    public productService: ProductService,
    private readonly _router: Router) {

  _router.events.pipe(
    filter(event => event instanceof NavigationStart)
  ).subscribe((route: NavigationStart) => {
    console.log("we are here in the filter")
    this.qtyItems = this.cartItemService.getQtyCartItems();
    console.log("tab1 onInit qtyItems = ", this.qtyItems);
  });

  //  this.extractsToggle = true;
  //  this.flowersToggle = true;
  //  this.ediblesToggle = true;

    // if (Capacitor.platform === 'web') {
      // this.testPluginWeb();
      // this.testYoutubePlayerPlugin();
    // } else {
      // this.testPluginNative();
    // }
    this
    .cartItemService
    .cartItemsData
    //.subscribe((cartItems: CartItem[]) => {
    //  this.cartItems = cartItems;
    //});
    //this.cartItemService.getAllCartItems();

    this
      .productService
      .productsData
      .subscribe((products: Product[]) => {
        this.products = products;
      });

    this.productService.getAllProducts();
  };

  ngAfterViewInit() {}

  ngOnInit() {
    var ii = 0;
    this._scanWindowImage = <HTMLDivElement>document.getElementById('scanImage');;
    this.canvasElement = <HTMLCanvasElement> document.getElementById('scan-canvas');
    this.canvasElement.style.display = "none";
    this._container = document.getElementById("aCanvas");
    this._container.style.display = "none";
    var tt = 0;

    this.qtyItems = this.cartItemService.getQtyCartItems();
    console.log("tab1 onInit qtyItems = ", this.qtyItems);

    //ext.startRender();
    console.log("iniialize scene");
    this._scene = new THREE.Scene();

    // init renderer
    console.log("Initialize Renderer");
    this._renderer = new THREE.WebGLRenderer({
        //canvas: thatCanvas,
        // antialias	: true,
        alpha: true,

        depth: false,
        stencil: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: true
    });
    
    this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this._renderer.shadowMap.enabled = true;

    this._renderer.setClearColor(new THREE.Color('lightgrey'), 0);
    this._renderer.setSize(window.innerWidth*0.7, window.innerHeight);
    console.log("width = " + window.innerWidth + " height = " + window.innerHeight);
    this._camera = new THREE.PerspectiveCamera(70, 100 / 48, 0.1, 500);
    this._scene.add(this._camera);
    this._camera.position.x = this._camPosDefault.x;
    this._camera.position.y = this._camPosDefault.y;
    this._camera.position.z = this._camPosDefault.z;
    this._camDir = new THREE.Vector3();
    this._camRight = new THREE.Vector3(0, 1, 0);
    this._camUp = new THREE.Vector3(0, 1, 0);

    var ambient = new THREE.AmbientLight(0xffffff);
    this._scene.add(ambient);

    var directionalLight = new THREE.DirectionalLight('white');
    directionalLight.position.set(1, 2, 7.3).setLength(2)
    directionalLight.shadow.mapSize.set(128, 128)
    directionalLight.shadow.camera.bottom = -0.6
    directionalLight.shadow.camera.top = 0.6
    directionalLight.shadow.camera.right = 0.6
    directionalLight.shadow.camera.left = -0.6
    directionalLight.castShadow = true;
    // scene.add(new THREE.CameraHelper( directionalLight.shadow.camera ))
    this._scene.add(directionalLight);

    this._raycaster = new THREE.Raycaster();
    this._mouse = new THREE.Vector2();
    this._bud; // **FIX - ???
    this._myPos = new THREE.Vector3();

    this._controls = new OrbitControls( this._camera, this._renderer.domElement );
    //this._controls.enableRotate = false;
    //this._controls.enableZoom = false;
    //this._controls.enablePan = false;
    //this._controls.minPolarAngle = -Math.PI;
    //this._controls.maxPolarAngle = Math.PI/4;
    this._controls.minAzimuthAngle = -Math.PI/3;
    this._controls.maxAzimuthAngle = Math.PI/3;

    // array of functions for the rendering loop
    var onRenderFcts = [];

    //var canvasdiv = document.getElementById("canvasDiv");
    //this._container = document.getElementById("aCanvas");
    if(this._container != null) {
      var ww = this._container.clientWidth;
      var hh = this._container.clientHeight;
      var rect = this._container.getBoundingClientRect();
      console.log("container rect = ", rect);
      console.log("client w,h = ", ww, " ", hh);
      console.log("window inner w,h = ", window.innerWidth, window.innerHeight)
      //this.renderer.setSize( rect.width, rect.height );
      this._container.width = this._scanWindowWidth; // window.innerWidth;
      this._container.height = this._scanWindowWidth; //window.innerWidth * 0.75;
      ////this._renderer.setSize( this._container.width, this._container.height );
      //this._renderer.setSize( this._container.clientWidth, this._container.clientHeight );
      this._renderer.setSize( 376, 252 );
      //// this.renderer.setSize( window.innerWidth, window.innerHeight*0.75 );
      this._container.appendChild( this._renderer.domElement );
    }
      
    this._container.addEventListener( 'mousedown', this.onMouseDown.bind(this), false );
    this._container.addEventListener( 'touchstart', this.onTouchStart.bind(this), false );
    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
  
    //this.buildXYZ();
  
    // load 3d models
    this._groupProductsParent = new THREE.Group;
    this._groupProducts = new THREE.Group;
    this._markerRoot = new THREE.Group;
    this._groupProductsParent.add(this._groupProducts);
    this._markerRoot.add(this._groupProductsParent);

    this.loadVendingMachine();
    this.loadSprites();
    if(this._bShowStoreName)
      this.buildStoreNameSurface();
    if(this._b3dProducts)
      this.loadModels();

    this._scene.add(this._markerRoot);
   }

  start3D() {

    this.render();
  } // end - main()


  onWindowResize() {
    /*      arToolkitSource.onResize()
    arToolkitSource.copySizeTo(renderer.domElement)
    if (arToolkitContext.arController !== null) {
      arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)
      //arToolkitSource.copySizeTo(thatCanvas)
    }
    */
    
    this._camera.aspect = window.innerWidth / window.innerHeight;    
    this._camera.updateProjectionMatrix();
    var rect = this._container.getBoundingClientRect();
    console.log("rect = ", rect);
    /*    console.log("setting sizes");
    this._container.width = window.innerWidth;
    this._container.height = window.innerWidth * 0.75;
    console.log("setting sizes2");
    var rect = this._container.getBoundingClientRect();
    console.log("setting sizes3");
    this.renderer.setSize( this._container.width, this._container.height );
    ////    this.renderer.setSize( window.innerWidth, window.innerHeight );
    console.log("set renderer size ", rect.width, " ", rect.height);
    ////    this.renderer.setViewport();
    */
  } // end - onWindowResize

  
  render() {
    if(this._bShow3d)
      requestAnimationFrame( this.render.bind(this) );
    
      if(this._spriteX.visible == true) {
        this._camera.getWorldPosition( this._spriteX.position );
        this._camera.getWorldDirection( this._camDir );
        this._spriteX.position.x += (this._camDir.x * 2);
        this._spriteX.position.y += (this._camDir.y * 2);
        this._spriteX.position.z += (this._camDir.z * 2);
  
        this._camRight.x = 2;
        this._camRight.y = 0;
        this._camRight.z = 0;
        this._camRight.applyQuaternion( this._camera.quaternion );
        this._spriteX.position.x += this._camRight.x;
        this._spriteX.position.y += this._camRight.y;
        this._spriteX.position.z += this._camRight.z;

        this._camUp.x = 0;
        this._camUp.y = 1;
        this._camUp.z = 0;
        this._camUp.applyQuaternion( this._camera.quaternion );
        this._spriteX.position.x += this._camUp.x;
        this._spriteX.position.y += this._camUp.y;
        this._spriteX.position.z += this._camUp.z;
      }
  
      if(this._bShowStoreName == true) {
        if(this._bStoreSprite) {
          this._camera.getWorldPosition( this._spriteStoreName.position );
          this._camera.getWorldDirection( this._camDir );
          this._spriteStoreName.position.x += (this._camDir.x * 2);
          this._spriteStoreName.position.y += (this._camDir.y * 2);
          this._spriteStoreName.position.z += (this._camDir.z * 2);
    
          /*this._camRight.x = 0;
          this._camRight.y = 0;
          this._camRight.z = 0;
          this._camRight.applyQuaternion( this._camera.quaternion );
          this._spriteStoreName.position.x += this._camRight.x;
          this._spriteStoreName.position.y += this._camRight.y;
          this._spriteStoreName.position.z += this._camRight.z;
          */

          this._camUp.x = 0;
          this._camUp.y = 1;
          this._camUp.z = 0;
          this._camUp.applyQuaternion( this._camera.quaternion );
          this._spriteStoreName.position.x += this._camUp.x;
          this._spriteStoreName.position.y += this._camUp.y;
          this._spriteStoreName.position.z += this._camUp.z;
        }
        else {
          this._camera.getWorldPosition( this._meshStoreName.position );
          //this._meshStoreName.setRotationFromQuaternion( this._spriteStoreName.quaternion );
          this._meshStoreName.quaternion.x = this._spriteBuds01.quaternion.x;
          this._meshStoreName.quaternion.y = this._spriteBuds01.quaternion.y;
          this._meshStoreName.quaternion.z = this._spriteBuds01.quaternion.z;
          this._meshStoreName.quaternion.w = this._spriteBuds01.quaternion.w;
          this._camera.getWorldDirection( this._camDir );
          this._meshStoreName.position.x += (this._camDir.x * 2);
          this._meshStoreName.position.y += (this._camDir.y * 2);
          this._meshStoreName.position.z += (this._camDir.z * 2);
    
          /*this._camRight.x = 0;
          this._camRight.y = 0;
          this._camRight.z = 0;
          this._camRight.applyQuaternion( this._camera.quaternion );
          this._spriteStoreName.position.x += this._camRight.x;
          this._spriteStoreName.position.y += this._camRight.y;
          this._spriteStoreName.position.z += this._camRight.z;
          */

          this._camUp.x = 0;
          this._camUp.y = 1.35;
          this._camUp.z = 0;
          this._camUp.applyQuaternion( this._camera.quaternion );
          this._meshStoreName.position.x += this._camUp.x;
          this._meshStoreName.position.y += this._camUp.y;
          this._meshStoreName.position.z += this._camUp.z;
        }
      }
  
        

    this._renderer.render( this._scene, this._camera );

    // Render frame.
    /*if(this._bOrthographic)
      this.renderer.render( this.scene, this.cameraOrtho );
    else
      this.renderer.render( this.scene, this.cameraPerspective );
    */

    //rotate background
    //var v = new THREE.Vector3(1, 0, 0);
    //this._meshCurtainL.rotateOnAxis(v, .05);
  
    //console.log("render");
  }; // end - render


  getUserName() {
    console.log("In Tab1 - getUserName")
    this.userName = this.globalService.getUserName();
    if(this.userName.length > 0)
      this.loggedIn = true;
  }

  toggleScan() {
    console.log("in toggleScan")
    if(this.scanWindowStatus == 0) { // showing the default image, now will scan qr code
      //this.scanStatus == "Scan QR Code"
      this.scanWindowStatus = 1; // showing scan video
      this.bShowScanWindow = true;
      this.bScannedData = false;
      this.startScan();
      this.scanStatus = "Cancel";
      this._scanWindowImage.style.display = "none";
      this.canvasElement.style.display = "block";
    }
    else if(this.scanWindowStatus == 1) {
      this.scanWindowStatus = 0;  // pressed cancel button on qr scan, go back to image
      this.scanStatus = "Scan QR Code";
      if(this.video) {
        (<MediaStream>this.video.srcObject).getTracks().forEach( stream => stream.stop());
        delete this.video;
        this.canvasElement.width = 0;
        this.canvasElement.height = 0;
        this.canvasElement.style.display = "none";
        this._scanWindowImage.style.display = "block"
      }
    }
    else if(this.scanWindowStatus == 2) {
      this.scanWindowStatus = 0; // close 3d and go back to image
      this.scanStatus = "Scan QR Code";
      this.bShowScanWindow = false;
      this._container.width = 0;
      this._container.height = 0;
      this._container.style.display = "none";
      this._scanWindowImage.style.display = "block"
    }
  }

  toggleAR() {
    this.arToggle = !this.arToggle;
  }
 
  toggleFlowers() {
    this.flowersToggle = !this.flowersToggle;
  }
 
  toggleEdibles() {
    this.ediblesToggle = !this.ediblesToggle;
  }
 
  toggleExtracts() {
    this.extractsToggle = !this.extractsToggle;
  }

  toggleAccessories() {
    this.accessoriesToggle = !this.accessoriesToggle;
  }

  togglePaws() {
    this.pawsToggle = !this.pawsToggle;
  }

  ionViewWillEnter() {
    this.qtyItems = this.cartItemService.getQtyCartItems();
    console.log("tab1 onViewWillEnter qtyItems = ", this.qtyItems);

    this.getUserName();
  }


  buildXYZ() {
    var mRed = new THREE.LineBasicMaterial({ color: 0xff0000 });
    var mGreen = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    var mBlue = new THREE.LineBasicMaterial({ color: 0x0000ff });
    
    var geometry2 = new THREE.Geometry();
    geometry2.vertices.push(
      new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( 10, 0, 0 )
    );  
    var line = new THREE.Line( geometry2, mRed );
    this._scene.add( line );
  
    geometry2 = new THREE.Geometry();
    geometry2.vertices.push( 
      new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 10, 0 ) 
    );  
    line = new THREE.Line( geometry2, mGreen );
    this._scene.add( line );
   
    geometry2 = new THREE.Geometry();
    geometry2.vertices.push(
      new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, 10 )
    );  
    line = new THREE.Line( geometry2, mBlue );
    this._scene.add( line );
  }; // end - buildXYZ


  buildStoreNameSurface() {
    var nWidth = 2, nHeight = 2;
    var xWidth = 5, yHeight = 1;
    var i,j;
    var x,y;
    var v0, v1, v2, v3, v4, v5;
    var u, v;
  
    var texture = new THREE.TextureLoader().load( 'assets/TheDoctors-01.png' );
  
    // immediately use the texture for material creation
    var material = new THREE.MeshBasicMaterial( { map: texture } );
  
    var geomBackground = new THREE.Geometry();
    geomBackground.faceVertexUvs[0] = [];
  
    var nFaces = 0;
    // build geometry - verts, faces, uvs
    for(j = 0; j < nHeight; j++) {
      for(i = 0; i < nWidth; i++) {
        // make verts
        x = -xWidth/2 + i*xWidth/(nWidth-1);
        y = -yHeight/2 + j*yHeight/(nHeight-1);
        //vert(i + nWidth*j).set(x,y)
        //console.log("x = ", x, " y = ", y);
        geomBackground.vertices.push(new THREE.Vector3(x, y, -0.5));
  
        // make faces
        if(j > 0 && i < nWidth-1) {
          v0 = i + (j-1)*nWidth;			
          v1 = i + 1 + (j-1)*nWidth;			
          v2 = i + j*nWidth;
    
          v3 = i + (j-1)*nWidth + 1;			
          v4 = i + j*nWidth + 1;			
          v5 = i + j*nWidth;
          //console.log("face0 v0 = ", v0, " v1 = ", v1, " v2 = ", v2)
          //console.log("face1 v3 = ", v3, " v4 = ", v4, " v5 = ", v5)
  
          geomBackground.faces.push( new THREE.Face3( v0, v1, v2 ) );
          geomBackground.faces.push( new THREE.Face3( v3, v4, v5 ) );
        }
    
        // set texture parameters u,v
        u = i/(nWidth-1);
        v = j/(nHeight-1);
        //console.log("u = ", u, " v = ", v);
        //console.log(" ");
      }
    }
  
    geomBackground.faceVertexUvs[0].push(
      [new THREE.Vector2(0,0), new THREE.Vector2(1,0), new THREE.Vector2(0,1)],
      [new THREE.Vector2(1,0), new THREE.Vector2(1,1), new THREE.Vector2(0,1)]
    );
  
    geomBackground.uvsNeedUpdate=true;
  
    geomBackground.computeBoundingSphere();
  
    this._meshStoreName = new THREE.Mesh( geomBackground, material );
  
    this._scene.add( this._meshStoreName );
  
  }; // end - buildStoreNameSurface


  loadVendingMachine() {
    var loader = new GLTFLoader();

    loader.load('assets/data/models/vendingMachine/vendingMachine-01.gltf', function (gltf) {
      var ii = 0;
      console.log(gltf.scene);
      var ob = gltf.scene.getObjectByName("weed_vending_machine");
      console.log(ob);
      ob.position.x = 0;
      ob.position.y = -3.15;
      ob.position.z = .5;
      ob.scale.x = 0.035;
      ob.scale.y = 0.025;
      ob.scale.z = 0.035;

      ob.userData = { objName: "Vending Machine" };
      this._groupProducts.add(ob);
      this._objects.push(ob);
      this._meshVendingMachine = ob;
    }.bind(this), undefined, function (error) {
      console.log("error loading vending machine");
      console.error(error);
    });
  } // end - loadVendingMachine()


  loadSprites() {
    this._groupSprites = new THREE.Group();

    var texture = new THREE.TextureLoader().load( 'assets/imgs/ico_spritex32.jpg' );
    var material = new THREE.SpriteMaterial( { map: texture } );
    this._spriteX = new THREE.Sprite( material );
    this._spriteX.name = "spriteX";
    this._spriteX.position.set( 4, 0, 2 );
    this._spriteX.visible = false;
    this._scene.add( this._spriteX );

    texture = new THREE.TextureLoader().load( 'assets/imgs/ico_spritestore.jpg' );
    material = new THREE.SpriteMaterial( { map: texture } );
    this._spriteStoreName = new THREE.Sprite( material );
    this._spriteStoreName.name = "spritestore";
    this._spriteStoreName.position.set( 0, -2, 2 );
    this._spriteStoreName.visible = false;
    this._scene.add( this._spriteStoreName );

    texture = new THREE.TextureLoader().load( 'assets/imgs/ico_ed_milkChocolate64-01.jpg' );
    material = new THREE.SpriteMaterial( { map: texture } );
    this._spriteMilkChocolate = new THREE.Sprite( material );
    this._spriteMilkChocolate.name = "milkChocolate";
    this._spriteMilkChocolate.position.set( -3.10, 2.5, 2 );
    this._spriteMilkChocolate.visible = true;
    this._groupSprites.add( this._spriteMilkChocolate );
    //this._spriteMikChocolate.position.normalize();
    //var radius = 13;
    //this._spriteMilkChocolate.position.multiplyScalar( radius );

    texture = new THREE.TextureLoader().load( 'assets/imgs/ico_ed_whiteChocolate64-01.jpg' );
    material = new THREE.SpriteMaterial( { map: texture } );
    this._spriteWhiteChocolate = new THREE.Sprite( material );
    this._spriteWhiteChocolate.name = "whiteChocolate";
    this._spriteWhiteChocolate.position.set( 2, 2.5, 2 );
    this._spriteWhiteChocolate.visible = true;
    this._groupSprites.add( this._spriteWhiteChocolate );

    texture = new THREE.TextureLoader().load( 'assets/imgs/ico_fl_buds64-01.jpg' );
    material = new THREE.SpriteMaterial( { map: texture } );
    this._spriteBuds01 = new THREE.Sprite( material );
    this._spriteBuds01.name = "buds01";
    this._spriteBuds01.position.set( -3.10, 1, 2 );
    this._spriteBuds01.visible = true;
    this._groupSprites.add( this._spriteBuds01 );

    texture = new THREE.TextureLoader().load( 'assets/imgs/ico_fl_buds64-03.jpg' );
    material = new THREE.SpriteMaterial( { map: texture } );
    this._spriteBuds03 = new THREE.Sprite( material );
    this._spriteBuds03.name = "buds03";
    this._spriteBuds03.position.set( 2, 1, 2 );
    this._spriteBuds03.visible = true;
    this._groupSprites.add( this._spriteBuds03 );

    texture = new THREE.TextureLoader().load( 'assets/imgs/ico_ed_gummyBears64-01.jpg' );
    material = new THREE.SpriteMaterial( { map: texture } );
    this._spriteGummyBears = new THREE.Sprite( material );
    this._spriteGummyBears.name = "gummyBears";
    this._spriteGummyBears.position.set( -3.10, -0.5, 2 );
    this._spriteGummyBears.visible = true;
    this._groupSprites.add( this._spriteGummyBears );

    texture = new THREE.TextureLoader().load( 'assets/imgs/ico_ex_coconutOil64-01.jpg' );
    material = new THREE.SpriteMaterial( { map: texture } );
    this._spriteCoconutOil = new THREE.Sprite( material );
    this._spriteCoconutOil.name = "coconutOil";
    this._spriteCoconutOil.position.set( 2, -0.5, 2 );
    this._spriteCoconutOil.visible = true;
    this._groupSprites.add( this._spriteCoconutOil );

    texture = new THREE.TextureLoader().load( 'assets/imgs/ico_pa_dogTreat64-01.jpg' );
    material = new THREE.SpriteMaterial( { map: texture } );
    this._spriteDogTreat = new THREE.Sprite( material );
    this._spriteDogTreat.name = "dogTreat";
    this._spriteDogTreat.position.set( -3.10, -2, 2 );
    this._spriteDogTreat.visible = true;
    this._groupSprites.add( this._spriteDogTreat );

    /*texture = new THREE.TextureLoader().load( 'assets/imgs/ico_ed_redGummyBear64-01.jpg' );
    material = new THREE.SpriteMaterial( { map: texture } );
    this._spriteRedGummyBear = new THREE.Sprite( material );
    this._spriteRedGummyBear.name = "redGummyBear";
    this._spriteRedGummyBear.position.set( 2, -2, 2 );
    this._spriteRedGummyBear.visible = true;
    this._groupSprites.add( this._spriteRedGummyBear );
    */
    /*texture = new THREE.TextureLoader().load( 'assets/imgs/ico_ac_waterPipe64-01.jpg' );
    material = new THREE.SpriteMaterial( { map: texture } );
    this._spriteWaterPipe = new THREE.Sprite( material );
    this._spriteWaterPipe.name = "waterPipe";
    this._spriteWaterPipe.position.set( 2, -2, 2 );
    this._spriteWaterPipe.visible = true;
    this._groupSprites.add( this._spriteWaterPipe );*/

    this._groupProducts.add( this._groupSprites );
  } // end - loadSprites


  loadModels() {
            // X: right y:out of screen z: down
            var loader = new GLTFLoader();
            var loaderObj = new OBJLoader();  
            
            this._meshMilkChocolate = new THREE.Object3D();
            this._meshWhiteChocolate = new THREE.Object3D();
            this._meshBuds01 = new THREE.Object3D();
            this._meshBuds03 = new THREE.Object3D();
            this._meshGummyBears = new THREE.Object3D();
            this._meshCoconutOil = new THREE.Object3D();
            this._meshDogTreat = new THREE.Object3D();
            //this._meshRedGummyBear = new THREE.Object3D();
            //this._meshWaterPipe = new THREE.Object3D();
          


  
//            loader.load('assets/data/models/chocolatebar/MilkChocolate2.glb', function (gltf) {
              loader.load('assets/data/models/chocolatebar/MilkChocolate.gltf', function (gltf) {
                console.log("Loading Milk Chocolate Bar");
                var ii = 0;
                console.log(gltf.scene);
                var ob = gltf.scene.getObjectByName("Box001");
                console.log(ob);
                ob.position.x = 0; //1.2;
                ob.position.y = 0.0;
                //ob.position.z = .5;
                ob.rotation.x = 1.57;
                ob.scale.x = 0.025;
                ob.scale.y = 0.025;
                ob.scale.z = 0.025;

                ob.userData = { objName: "Milk Chocolate Bar" };
                this._groupProducts.add(ob);
                this._objects.push(ob);
                this._meshMilkChocolate = ob;
                this._meshMilkChocolate.visible = false;
            }.bind(this), undefined, function (error) {
                console.log("error loading chocolate bar");
                console.error(error);
            });

            //loader.load('assets/data/models/chocolatebar/WhiteChocolate.gltf', function (gltf) {
            loader.load('assets/data/models/chocolatebar/WhiteChocolate2.gltf', function (gltf) {
              console.log("Loading White Chocolate Bar");
              var ii = 0;
                console.log(gltf.scene);
                var ob = gltf.scene.getObjectByName("Box001");
                console.log(ob);
                ob.position.x = 0; //-1.0;
                ob.position.y = 0.0;
                ob.rotation.x = 3.14;
                ob.scale.x = 0.025;
                ob.scale.y = 0.025;
                ob.scale.z = 0.025;
                var ch = ob.children[0];
                //ob.userData = { objId: 1001 };
                ob.userData = { objName: "White Chocolate Bar" }; 
                //markerRoot.add(ob);
                this._groupProducts.add(ob);
                this._objects.push(ob);
                this._meshWhiteChocolate = ob;
                this._meshWhiteChocolate.visible = false;
            }.bind(this), undefined, function (error) {
                console.error(error);
            });

            loader.load('assets/data/models/weedbud/weedbud.gltf', function (gltf) {
              console.log("Loading Weed Bud");
              var ii = 0;
                console.log(gltf.scene);
                var ob = gltf.scene.getObjectByName("Group38207");
                console.log(ob);
                //ob.position.x = -0.5;
                //ob.position.y = 0.15;
                ob.rotation.x = 1.57;
                ob.scale.x = 0.025;
                ob.scale.y = 0.025;
                ob.scale.z = 0.025;
                var ch = ob.children[0];
                //markerRoot.add(ob);
                //ob.userData = { objId: 1002 };
                ob.userData = { objName: "Weed Bud" };
                this._bud = ob;
                var p;
                this._bud.getWorldPosition(this.myPos);
                console.log("budPos =", this.myPos)
                this._groupProducts.add(ob);
                this._objects.push(ob);
                this._meshBuds01 = ob;
                this._meshBuds03 = ob;
                this._meshBuds01.visible = false;
                this._meshBuds03.visible = false;
            }.bind(this), undefined, function (error) {
                console.error(error);
            });

            loader.load('assets/data/models/redgummybear/gummybears.gltf', function (gltf) {
              console.log("Loading Gummy Bears");
              var ii = 0;
                var groupGummy = new THREE.Group;
                console.log(gltf.scene);
                var ob = gltf.scene.getObjectByName("gummy_bear_red");
                //ob.userData = { objId: 1003 };
                ob.userData = { objName: "Gummy Bears" };
                groupGummy.add(ob);
                this._objects.push(ob);
                //markerRoot.add(ob);
                var tt = 0;
                var ob = gltf.scene.getObjectByName("gummy_bear_blue");
                //ob.userData = { objId: 1003 };
                ob.userData = { objName: "Gummy Bears" };
                groupGummy.add(ob);
                this._objects.push(ob);
                //markerRoot.add(ob);
                var tt = 0;
                var ob = gltf.scene.getObjectByName("gummy_bear_yellow");
                //ob.userData = { objId: 1003 };
                ob.userData = { objName: "Gummy Bears" };
                groupGummy.add(ob);
                this._objects.push(ob);
                var ob = gltf.scene.getObjectByName("gummy_bear_green");
                ob.userData = { objName: "Gummy Bears" };
                console.log(ob);
                groupGummy.add(ob);
                this._objects.push(ob);

                groupGummy.position.x = 0; //-2.2;
                groupGummy.position.y = 0.35;
                groupGummy.rotation.x = 1.57;
                groupGummy.scale.x = 0.25;
                groupGummy.scale.y = 0.25;
                groupGummy.scale.z = 0.25;

                this._groupProducts.add(groupGummy);
                this._meshGummyBears = groupGummy;
                this._meshGummyBears.visible = false;
              }.bind(this), undefined, function (error) {
                console.error(error);
            });

            loader.load('assets/data/models/coconutoil/coconutoil2.gltf', function (gltf) {
              console.log("Loading Coconut Oil");
              var ii = 0;
      //        this._scene.add(gltf);
              console.log(gltf.scene);
              var groupOilJar = new THREE.Group

              var ob = gltf.scene.getObjectByName("Label");
              console.log(ob);
              ob.scale.x = 0.2;
              ob.scale.y = 0.2;
              ob.scale.z = 0.2;
              ob.userData = { objName: "Infused Coconut Oil" };
              groupOilJar.add(ob);
              this._objects.push(ob);

              ob = gltf.scene.getObjectByName("Bottle");
              console.log(ob);
              ob.scale.x = 0.192;
              ob.scale.y = 0.192;
              ob.scale.z = 0.192;
              groupOilJar.add(ob);
              this._objects.push(ob);

              groupOilJar.position.x = 0; //2.6;
              groupOilJar.position.y = -0.7;
              groupOilJar.position.z = 0;
              groupOilJar.rotation.x = 1.57;
              this._groupProducts.add(groupOilJar);
              this._meshCoconutOil = groupOilJar;
              this._meshCoconutOil.visible = false;
            }.bind(this), undefined, function (error) {
              console.log("printing error from bottle loading");
                console.error(error);
            });
      
            /*loader.load('assets/data/models/redgummybear/gummybears.gltf', function (gltf) {
              var ii = 0;
              var groupRedGummy = new THREE.Group;
              console.log(gltf.scene);
              var ob = gltf.scene.getObjectByName("gummy_bear_red");
              //ob.userData = { objId: 1003 };
              ob.userData = { objName: "Gummy Bears" };
              groupRedGummy.add(ob);
              this._objects.push(ob);
              //markerRoot.add(ob);

              groupRedGummy.position.x = 0; //-2.2;
              groupRedGummy.position.y = 0.35;
              groupRedGummy.rotation.x = 1.57;
              groupRedGummy.scale.x = 0.25;
              groupRedGummy.scale.y = 0.25;
              groupRedGummy.scale.z = 0.25;

              this._groupProducts.add(groupRedGummy);
              this._meshGummyBears = groupRedGummy;
              this._meshGummyBears.visible = false;
            }.bind(this), undefined, function (error) {
              console.error(error);
          });

          loaderObj.load('assets/data/models/bong/bong-01.obj', function (gltf) {
            var ii = 0;
            var ob = gltf.children[0];
            var texture = new THREE.TextureLoader().load( 'assets/data/models/bong/rasta.jpg' );
            ob.material.map = texture;

            console.log(ob);
            ob.position.x = 0; //-4;
            ob.position.y = -0.75;
            ob.position.z = 0.;
            ob.rotation.x = 0.0;
            ob.rotation.y = 1.57;
            ob.scale.x = 0.5;
            ob.scale.y = 0.5;
            ob.scale.z = 0.5;
            ob.userData = { objName: "bong" };
            this._groupProducts.add(ob);
            this._objects.push(ob);
            this._meshWaterPipe = ob;
            this._meshWaterPipe.visible = false;
        }.bind(this), undefined, function (error) {
            console.error(error);
        });*/

      loaderObj.load('assets/data/models/dogTreat/dog_biscuit.obj', function (gltf) {
        console.log("Loading Dog Biscuit");
        var ii = 0;
              var ob = gltf.children[0];
              var texture = new THREE.TextureLoader().load( 'assets/data/models/dogTreat/dog_biscuit_diffuse.jpg' );
              ob.material.map = texture;

              console.log(ob);
              ob.position.x = 0; //4.5;
              //ob.position.y = 0.15;
              ob.rotation.x = 1.57;
              ob.rotation.y = 1.57;
              ob.scale.x = 0.075;
              ob.scale.y = 0.075;
              ob.scale.z = 0.075;
              ob.userData = { objName: "dogbiscuit" };
              this._groupProducts.add(ob);
              this._objects.push(ob);
              this._meshDogTreat = ob;
              this._meshDogTreat.visible = false;
          }.bind(this), undefined, function (error) {
              console.error(error);
          });


          // add a transparent ground-plane shadow-receiver
          var material = new THREE.ShadowMaterial();
          material.opacity = 0.7; //! bug in threejs. can't set in constructor

          var geometry = new THREE.PlaneGeometry(3, 3)
          var planeMesh = new THREE.Mesh(geometry, material);
          planeMesh.receiveShadow = true;
          ////planeMesh.depthWrite = false;
          planeMesh.rotation.x = -Math.PI / 2;
          this._markerRoot.add(planeMesh);
  }  // end - loadModels


  onMouseDown( event ) {
    //event.preventDefault();

    //this._bMouseDown = true;
  
    var rect = this._container.getBoundingClientRect();
    this._mouse.x = ((event.clientX - rect.left) / this._renderer.domElement.clientWidth) * 2 - 1;
    this._mouse.y = -((event.clientY - rect.top) / this._renderer.domElement.clientHeight) * 2 + 1;
    //console.log("mouse down screena x,y = ", this._mouse.x, " ", this._mouse.y);

    this.eventDown(this._mouse.x, this._mouse.y);
  } // end - onMouseDown


  onTouchStart( evt ) {
    var rect = this._container.getBoundingClientRect();
    console.log("touch down rect = ", rect);
    //console.log("touch start client x, y = ", evt.touches[0].clientX, " ", evt.touches[0].clientY);
    var x = ((evt.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
    var y = -((evt.touches[0].clientY - rect.top) / rect.height) * 2 + 1;
    console.log("touch start scaled x, y = ", x, " ", y);
    this.eventDown(x, y);
  } // end - onTouchStart


  eventDown( x, y ) {
    this._mouse.x = x;
    this._mouse.y = y;

    //console.log("event down1");

    // mouse in screen coords
    //console.log("mouse screen x,y = ", mouse.x, " ", mouse.y);

    this._raycaster.setFromCamera( this._mouse, this._camera );

    this._intersects = this._raycaster.intersectObject( this._spriteStoreName, true );
    if ( this._intersects.length > 0 ) {
      if(this._intersects[0].object.name == "spritestore") {
        this._router.navigate(['/map'])
        //routerLink="/product-detail/{{ product.id }}" 
      }
    }

    //intersect the button sprites
    this._intersects = this._raycaster.intersectObject( this._spriteX, true );
    if ( this._intersects.length > 0 ) {
      if(this._intersects[0].object.name == "spriteX") {
        // turn on product sprites
        this._groupSprites.visible = true;
        this._meshVendingMachine.visible = true;
        // reset camera to default position for viewing vending machine
        this._camera.position.x = this._camPosDefault.x;
        this._camera.position.y = this._camPosDefault.y;
        this._camera.position.z = this._camPosDefault.z;
        this._camera.lookAt(0, 0, 0);
            // turn on sprite to revert to vending machine
        this._spriteX.visible = false;
        // turn off 3d objects
        if(this._b3dProducts) {
          this._meshMilkChocolate.visible = false;
          this._meshWhiteChocolate.visible = false;
          this._meshBuds01.visible = false;
          this._meshBuds03.visible = false;
          this._meshGummyBears.visible = false;
          this._meshCoconutOil.visible = false;
          this._meshDogTreat.visible = false;
          //this._meshRedGummyBear.visible = false;
          //this._meshWaterPipe.visible = false;
        }
      }
    }

    this._intersects = this._raycaster.intersectObject( this._groupSprites, true );
    if ( this._intersects.length > 0 ) {
      console.log("have sprite intersection ", this._intersects[0].object.name);
      // if not showing 3d products, just scroll list to correct product
      // if showing 3d products, turn all of and show 3d product
      if(!this._b3dProducts) {
        if(this._intersects[0].object.name == "milkChocolate") {
          // scroll list to item that was selected
          this.doScroller(5);
        }
        else if(this._intersects[0].object.name == "whiteChocolate") {
          // scroll list to item that was selected
          this.doScroller(6);
        }
        else if(this._intersects[0].object.name == "buds01") {
          // scroll list to item that was selected
          this.doScroller(0);
        }
        else if(this._intersects[0].object.name == "buds03") {
          // scroll list to item that was selected
          this.doScroller(1);
        }
        else if(this._intersects[0].object.name == "gummyBears") {
          // scroll list to item that was selected
          this.doScroller(2);
        }
        else if(this._intersects[0].object.name == "coconutOil") {
          // scroll list to item that was selected
          this.doScroller(3);
        }
        else if(this._intersects[0].object.name == "dogTreat") {
          // scroll list to item that was selected
          this.doScroller(8);
        }
        /*else if(this._intersects[0].object.name == "redGummyBear") {
          // scroll list to item that was selected
          this.doScroller(7);
        }*/
        /*else if(this._intersects[0].object.name == "waterPipe") {
          // scroll list to item that was selected
          this.doScroller(7);
        }*/
      }
      else { // show 3d products
        if(this._intersects[0].object.name == "milkChocolate") {
          // scroll list to item that was selected
          this.doScroller(5);
          // turn off product sprites
          this._groupSprites.visible = false;
          this._meshVendingMachine.visible = false;
          // turn on sprite to revert to vending machine
          this._spriteX.visible = true;
          // turn on 3d object
          this._meshMilkChocolate.visible = true;
          // set camera to default position for viewing product
          this._camera.position.x = this._camPosProduct.x;
          this._camera.position.y = this._camPosProduct.y;
          this._camera.position.z = this._camPosProduct.z;
          this._camera.lookAt(0, 0, 0);
        }
        else if(this._intersects[0].object.name == "whiteChocolate") {
          // scroll list to item that was selected
          this.doScroller(6);
          // turn off product sprites
          this._groupSprites.visible = false;
          this._meshVendingMachine.visible = false;
          // turn on sprite to revert to vending machine
          this._spriteX.visible = true;
          // turn on 3d object
          this._meshWhiteChocolate.visible = true;
          // set camera to default position for viewing product
          this._camera.position.x = this._camPosProduct.x;
          this._camera.position.y = this._camPosProduct.y;
          this._camera.position.z = this._camPosProduct.z;
          this._camera.lookAt(0, 0, 0);
        }
        else if(this._intersects[0].object.name == "buds01") {
          // scroll list to item that was selected
          this.doScroller(0);
          // turn off product sprites
          this._groupSprites.visible = false;
          this._meshVendingMachine.visible = false;
          // turn on sprite to revert to vending machine
          this._spriteX.visible = true;
          // turn on 3d object
          this._meshBuds01.visible = true;
          // set camera to default position for viewing product
          this._camera.position.x = this._camPosProduct.x;
          this._camera.position.y = this._camPosProduct.y;
          this._camera.position.z = this._camPosProduct.z;
          this._camera.lookAt(0, 0, 0);
        }    
        else if(this._intersects[0].object.name == "buds03") {
          // scroll list to item that was selected
          this.doScroller(1);
          // turn off product sprites
          this._groupSprites.visible = false;
          this._meshVendingMachine.visible = false;
          // turn on sprite to revert to vending machine
          this._spriteX.visible = true;
          // turn on 3d object
          this._meshBuds03.visible = true;
          // set camera to default position for viewing product
          this._camera.position.x = this._camPosProduct.x;
          this._camera.position.y = this._camPosProduct.y;
          this._camera.position.z = this._camPosProduct.z;
          this._camera.lookAt(0, 0, 0);
        }
        else if(this._intersects[0].object.name == "gummyBears") {
          // scroll list to item that was selected
          this.doScroller(2);
          // turn off product sprites
          this._groupSprites.visible = false;
          this._meshVendingMachine.visible = false;
          // turn on sprite to revert to vending machine
          this._spriteX.visible = true;
          // turn on 3d object
          this._meshGummyBears.visible = true;
          // set camera to default position for viewing product
          this._camera.position.x = this._camPosProduct.x;
          this._camera.position.y = this._camPosProduct.y;
          this._camera.position.z = this._camPosProduct.z;
          this._camera.lookAt(0, 0, 0);
        } 
        else if(this._intersects[0].object.name == "coconutOil") {
          // scroll list to item that was selected
          this.doScroller(3);
          // turn off product sprites
          this._groupSprites.visible = false;
          this._meshVendingMachine.visible = false;
          // turn on sprite to revert to vending machine
          this._spriteX.visible = true;
          // turn on 3d object
          this._meshCoconutOil.visible = true;
          // set camera to default position for viewing product
          this._camera.position.x = this._camPosProduct.x;
          this._camera.position.y = this._camPosProduct.y;
          this._camera.position.z = this._camPosProduct.z;
          this._camera.lookAt(0, 0, 0);
        } 
        else if(this._intersects[0].object.name == "dogTreat") {
          // scroll list to item that was selected
          this.doScroller(8);
          // turn off product sprites
          this._groupSprites.visible = false;
          this._meshVendingMachine.visible = false;
          // turn on sprite to revert to vending machine
          this._spriteX.visible = true;
          // turn on 3d object
          this._meshDogTreat.visible = true;
          // set camera to default position for viewing product
          this._camera.position.x = this._camPosProduct.x;
          this._camera.position.y = this._camPosProduct.y;
          this._camera.position.z = this._camPosProduct.z;
          this._camera.lookAt(0, 0, 0);
        } 
        /*else if(this._intersects[0].object.name == "redGummyBear") {
          // scroll list to item that was selected
          this.doScroller(7);
          // turn off product sprites
          this._groupSprites.visible = false;
          this._meshVendingMachine.visible = false;
          // turn on sprite to revert to vending machine
          this._spriteX.visible = true;
          // turn on 3d object
          this._meshRedGummyBear.visible = true;
          // set camera to default position for viewing product
          this._camera.position.x = this._camPosProduct.x;
          this._camera.position.y = this._camPosProduct.y;
          this._camera.position.z = this._camPosProduct.z;
          this._camera.lookAt(0, 0, 0);
        }*/
        /*else if(this._intersects[0].object.name == "waterPipe") {
          // scroll list to item that was selected
          this.doScroller(7);
          // turn off product sprites
          this._groupSprites.visible = false;
          this._meshVendingMachine.visible = false;
          // turn on sprite to revert to vending machine
          this._spriteX.visible = true;
          // turn on 3d object
          this._meshWaterPipe.visible = true;
          // set camera to default position for viewing product
          this._camera.position.x = this._camPosProduct.x;
          this._camera.position.y = this._camPosProduct.y;
          this._camera.position.z = this._camPosProduct.z;
          this._camera.lookAt(0, 0, 0);
        }*/
      } // end switch to showing 3d products 
    }    
  } // end - eventDown


  doScroller( itemNum ) {
    /*
    _spriteMilkChocolate
    _spriteWhiteChocolate
    _spriteBuds01
    _spriteBuds03
    _spriteGummyBears
    _spriteCoconutOil
    _spriteDogTreat
    _spriteWaterPipe
    */
    //*FIX - this is hack guess item height and drive to that position
    var headerHeight = 65;
    var itemHeight = 85;
    //itemNum = 4;
    this.content.scrollToPoint(0, headerHeight + (itemNum * itemHeight), 500); 
  }
  // end - doScroller


  startScan() {
    //this.canvasElement = <HTMLCanvasElement> document.getElementById('scan-canvas');
    this.canvasElement = <HTMLCanvasElement> document.getElementById('scan-canvas');
    this.canvasContext = this.canvasElement.getContext('2d');
    ////this.outputContainer = <HTMLDivElement>document.getElementById('output');
    ////this.outputMessage = <HTMLDivElement>document.getElementById('outputMessage');
    ////this.outputData = <HTMLDivElement>document.getElementById('outputData');

    var vid = <HTMLVideoElement>document.getElementById('video');
    if(vid == null) {
      this.video = <HTMLVideoElement>document.createElement('video');
      this.videoDivElement = <HTMLDivElement>document.createElement('videoDiv');
      this.videoDivElement.appendChild(this.video);
    }
    else {
      this.video = vid;
      this.bScannedData = false;
      this.scanText = "";
      this.newText = "";
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(async (stream: MediaStream) => {
        this.video.srcObject = stream;
        this.video.setAttribute('playsinline', 'true'); // required to tell iOS safari we don't want fullscreen
        await this.video.play();
        requestAnimationFrame(this.tick.bind(this));
    });    
  }

  drawLine(begin, end, color): void {
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(begin.x, begin.y);
    this.canvasContext.lineTo(end.x, end.y);
    this.canvasContext.lineWidth = 4;
    this.canvasContext.strokeStyle = color;
    this.canvasContext.stroke();
  }

  tick(): void {
    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.canvasElement.hidden = false;
      ////this.outputContainer.hidden = false;

      this.canvasElement.height = this._scanWindowHeight; // this.video.videoHeight;
      this.canvasElement.width = this._scanWindowWidth; //this.video.videoWidth;
      this.canvasContext.drawImage(this.video, 0, 0, this.canvasElement.width, this.canvasElement.height);
      const imageData: ImageData = this.canvasContext.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);
      const code: QRCode = jsQR(imageData.data, imageData.width, imageData.height);
        
      if (code) {
        this.drawLine(code.location.topLeftCorner, code.location.topRightCorner, '#FF3B58');
        this.drawLine(code.location.topRightCorner, code.location.bottomRightCorner, '#FF3B58');
        this.drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, '#FF3B58');
        this.drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, '#FF3B58');
      
        /* this.outputMessage.hidden = true;
        this.outputData.parentElement.hidden = false;
        */
        this.qrcodeDetected = code.data;
        this.bScannedData = true;
        this.scanText = code.data;
        this.newText =this.scanText.replace(/\r\n/g, '<br />').replace(/[\r\n]/g, '<br />');

        //organize the data for local display
        this.organizeScannedData(this.scanText);
        
        //new stuff
        if(this.bScannedData) {
          this.scanStatus = "Close 3d";  // close scanner and goto 3d window
          this.scanWindowStatus = 2; // scanned valid qr code and now show 3d
          this.canvasContext.clearRect;
          this.canvasElement.height = 0;
          this.canvasElement.width = 0;
       
          (<MediaStream>this.video.srcObject).getTracks().forEach( stream => stream.stop());
          delete this.video;

          this.canvasElement.style.display = "none";
          this._container.style.display = "block";

          // start 3d rendering
          this._bShow3d = true;
          this.start3D();
        } 
        else {
          ////this.outputMessage.hidden = false;
          ////this.outputData.parentElement.hidden = true;
        }
      }
    }
    if(!this.bScannedData)
      requestAnimationFrame(this.tick.bind(this));
  }
  

  organizeScannedData(txt:string) {
    //split the text string into separate strings based on line feed character
    var array = txt.split(/\r?\n/);

    if(array[0] == "VendMoi")
      this.bScannedData = true;
  } // end - organizeScannedData
}
