require([], function(){
    // detect WebGL
    if( !Detector.webgl )
		{
        Detector.addGetWebGLMessage();
        throw 'WebGL Not Available'
		}

    var camera, scene, renderer;
	var geometry, material, mesh;
	init();
	//animate();
	function init() 
		{
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth /
		window.innerHeight, 1, 1000 );
		camera.position.z = 500;
		scene = new THREE.Scene();
		//done creating scene
		var geometry = new THREE.SphereBufferGeometry( 5, 32, 32 );
		var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
		var sphere = new THREE.Mesh( geometry, material );
		scene.add( sphere );
		
		renderer = new THREE.CanvasRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );
		}
	/*function animate()
	{
		requestAnimationFrame( animate );
		sphere.rotation.x = Date.now() * 0.00005;
		sphere.rotation.y = Date.now() * 0.0001;
		renderer.render( scene, camera );
	}
	*/
})