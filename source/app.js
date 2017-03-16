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
	var raindrop; 

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
		var axisHelper = new THREE.AxisHelper( 5 );
		scene.add( axisHelper );
		//create clock
		clock = new THREE.Clock();
		controls = new THREE.TrackballControls(camera);
		controls.movementSpeed = 100;
		controls.lookSpeed = 0.1;
		//create planet
		planetgeo         = new THREE.SphereBufferGeometry( radius, 80, 80 );
		planetmaterial    = new THREE.MeshBasicMaterial ( {shading: THREE.SmoothShading, overdraw: true, color: 0x0077BE} );
		planet            = new THREE.Mesh( planetgeo, planetmaterial );
		scene.add( planet );
		//create character 
		charactergeo      = new THREE.IcosahedronGeometry( 25, 1 );
		charactermaterial = new THREE.MeshNormalMaterial( {shading: THREE.SmoothShading} );
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
		//planet.rotation.x = Date.now() * 0.00005;
		//planet.rotation.y = Date.now() * 0.0001;
		controls.update(clock.getDelta());
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
	     console.log(raindrop);

	}, false);
})