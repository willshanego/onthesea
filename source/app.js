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
		planetgeo         = new THREE.IcosahedronGeometry( 200, 1 );
		planetmaterial    = new THREE.MeshBasicMaterial( { shading: THREE.SmoothShading } );
		planet            = new THREE.Mesh( planetgeo, planetmaterial );
		scene.add( planet );
		//create character
		charactergeo      = new THREE.CylinderGeometry( 5, 5, 20, 32 );
		charactermaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
		character         = new THREE.Mesh( charactergeo, material );
		scene.add( character );
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
		renderer.render( scene, camera );
	}
})