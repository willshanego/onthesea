require([], function(){
    // detect WebGL
    if( !Detector.webgl )
		{
        Detector.addGetWebGLMessage();
        throw 'WebGL Not Available'
    }

    var camera, scene, renderer;
	var planetgeo, planetmaterial, planet;
	var charactergeo, charactermaterial, character;
	
	init();
	animate();
	function init() 
		{
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth /
		window.innerHeight, 1, 1000 );
		camera.position.z = 500;
		scene = new THREE.Scene();
		//create planet
		planetgeo         = new THREE.SphereBufferGeometry( 200, 150, 150 );
		planetmaterial    = new THREE.MeshNormalMaterial ( {shading: THREE.SmoothShading, overdraw: true} );
		planet            = new THREE.Mesh( planetgeo, planetmaterial );
		scene.add( planet );
		//create character 
		charactergeo      = new THREE.IcosahedronGeometry( 50, 1 );
		charactermaterial = new THREE.MeshNormalMaterial( {shading: THREE.SmoothShading} );
		character         = new THREE.Mesh( charactergeo, charactermaterial );
		character.translateOnAxis( new THREE.Vector3(0,250,0), 1);
		scene.add( character );
		//
		renderer = new THREE.CanvasRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );
		}
	function animate()
	{
		requestAnimationFrame( animate );
		planet.rotation.x = Date.now() * 0.05;
		planet.rotation.y = Date.now() * 0.01;
		
		renderer.render( scene, camera );
	}
})