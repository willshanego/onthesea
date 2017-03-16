require([], function(){
    // detect WebGL
    if( !Detector.webgl )
		{
        Detector.addGetWebGLMessage();
        throw 'WebGL Not Available'
    }
	
    var projector, camera, scene, renderer, mousePosition;
    var controls, clock;
    var radius; 
	var planetgeo, planetmaterial, planet;
	var charactergeo, charactermaterial, character;
	var objects;
	var zvalue;
	var wave, normal, planeForCircle, sphereForCircle;
	var raindrop; 
	var ambient, directionalLight;
	var boat;
	
	//
	init();
	animate();
	function init() 
		{
		radius = 100;
		projector = new THREE.Projector();
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth /
		window.innerHeight, 1, 1000 );
		camera.position.z = 500;
		scene = new THREE.Scene();
		wave = new THREE.Shape();
		sphereForCircle = new THREE.Sphere((0,0,0),radius)
		var axisHelper = new THREE.AxisHelper( 5 );
		scene.add( axisHelper );
		//create clock
		clock = new THREE.Clock();
		controls = new THREE.TrackballControls(camera);
		controls.movementSpeed = 100;
		controls.lookSpeed = 0.1;
		//create light
		ambient = new THREE.AmbientLight(0x666666);
		directionalLight = new THREE.DirectionalLight(0xffeedd);
        directionalLight.position.set(0, 70, 100).normalize();
        scene.add(ambient);
        scene.add(directionalLight);
		//load model
		var manager = new THREE.LoadingManager();
		manager.onProgress = function ( item, loaded, total )
		    {
			console.log( item, loaded, total );
			};
			// model
		var loader = new THREE.OBJLoader( manager );
		loader.load( 'boat.json', function ( boat )
			{
			boat.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh )
				{
				//child.material.map = texture;
				}
			} 
			);

				boat.position.x = - 60;
                boat.rotation.x = 20* Math.PI / 180;
                boat.rotation.z = 20* Math.PI / 180;
                boat.scale.x = 30;
                boat.scale.y = 30;
                boat.scale.z = 30;
				scene.add( boat );
				} );





		//create planet
		planetgeo         = new THREE.SphereBufferGeometry( radius, 80, 80 );
		planetmaterial    = new THREE.MeshPhongMaterial ( {shading: THREE.SmoothShading, overdraw: true, color: 0x0077BE} );
		planet            = new THREE.Mesh( planetgeo, planetmaterial );
		scene.add( planet );
		//create character 
		charactergeo      = new THREE.IcosahedronGeometry( 25, 1 );
		charactermaterial = new THREE.MeshPhongMaterial( {shading: THREE.SmoothShading} );
		character         = new THREE.Mesh( charactergeo, charactermaterial );
		character.translateOnAxis( new THREE.Vector3(0,125,0), 1);
		scene.add( character );
		//
		objects = [ planet, character];
		planet.material.opacity = .2;
		//
		renderer = new THREE.CanvasRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );
		}
	function animate()
	{
		requestAnimationFrame( animate );
		planet.rotation.x = Date.now() * 0.00005;
		planet.rotation.y = Date.now() * 0.0001;
		controls.update(clock.getDelta());
		//createwave();
		renderer.render( scene, camera );
	}
	
	renderer.domElement.addEventListener('mousedown', function(event) 
	{
		 var vector = new THREE.Vector3();

		 vector.set(
			( event.clientX / window.innerWidth ) * 2 - 1,
			- ( event.clientY / window.innerHeight ) * 2 + 1,
			0.5 );

		 vector.unproject( camera );

		 var dir = vector.sub( camera.position ).normalize();

		 var distance = - camera.position.z / dir.z;

	     raindrop = camera.position.clone().add( dir.multiplyScalar( distance ) );
	     //console.log(raindrop);
	     zvalue = Math.sqrt(Math.pow(radius,2)-Math.pow(raindrop.x,2)-Math.pow(raindrop.y,2))
		 //console.log(zvalue);	
		 normal = new THREE.Vector3( (raindrop.x-0), (raindrop.y-0), (zvalue-0));
		 planeForCircle = new THREE.Plane(normal, radius) ;
		 console.log(planeForCircle.Vector3);	
		 console.log(normal);	
	}, false);

	function createwave()
	{
		
		//wave.moveTo (raindrop.x, raindrop.y, zvalue);
	}
	function createScene(geometry, x, y, z, scale, tmap)
	{
            zmesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture(tmap)}));
            zmesh.position.set(x, y, z);
            zmesh.scale.set(scale, scale, scale);
            meshes.push(zmesh);
            scene.add(zmesh);
    }
})