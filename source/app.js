require([], function() {
    // detect WebGL
    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
        throw 'WebGL Not Available'
    }

    var mouse = new THREE.Vector2(), INTERSECTED;
    var projector, camera, scene, renderer, mousePosition, raycaster, axisHelper;
    var ambient, directionalLight;
    var controls, clock;
    var planetgeo, planetmaterial, planet, planetradius;
    var charactergeo, charactermaterial, character;
    var boat;
    var objects;
    var normal, zvalue, radius;
    var raindrop, vectorA, vectorB, vectorV, vectorI;

    //
    init();
    animate();
    function init() {
        //create scene, projector, camera, axis, etc
        projector = new THREE.Projector();
        camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,1,1000);
        camera.position.z = 500;
        scene = new THREE.Scene();
        axisHelper = new THREE.AxisHelper(5);
        scene.add(axisHelper);
        raycaster = new THREE.Raycaster();
        raindrop = new THREE.Vector3();

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

        //init vectors
        //vectorV = new THREE.Vector3();
        //vectorA = new THREE.Vector3();
        //vectorB = new THREE.Vector3();
        //load model
        // instantiate a loader
        var loader = new THREE.JSONLoader();
        // load a resource
        loader.load(// resource URL
        'vendor/boat.json', // Function when resource is loaded
        function(geometry, materials) {
            var boatmaterial = new THREE.MultiMaterial(materials);
            var boatobject = new THREE.Mesh(geometry,material);
            scene.add(boatobject);
        });

        //create planet
        planetradius = 100;
        planetgeo = new THREE.SphereBufferGeometry(planetradius,80,80);
        planetmaterial = new THREE.MeshPhongMaterial({
            shading: THREE.SmoothShading,
            overdraw: true,
            color: 0x0077BE
        });
        planet = new THREE.Mesh(planetgeo,planetmaterial);
        scene.add(planet);
        //create character 
        charactergeo = new THREE.IcosahedronGeometry(25,1);
        charactermaterial = new THREE.MeshPhongMaterial({
            shading: THREE.SmoothShading
        });
        character = new THREE.Mesh(charactergeo,charactermaterial);
        character.translateOnAxis(new THREE.Vector3(0,125,0), 1);
        scene.add(character);
        //create wave
        //
        objects = [planet, character];
        planet.material.opacity = 1;
        //
        renderer = new THREE.CanvasRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
    }

    function animate() {
        requestAnimationFrame(animate);
        //planet.rotation.x = Date.now() * 0.00005;
        //planet.rotation.y = Date.now() * 0.0001;
        controls.update(clock.getDelta());
        //createwave();
        renderer.render(scene, camera);
    }

    renderer.domElement.addEventListener('mousemove', function(event) {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }, false);

    renderer.domElement.addEventListener('mousedown', function(event) {
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length > 0) {
            raindrop = intersects[0].point;
            /*if (INTERSECTED != intersects[0].object) {
                if (INTERSECTED)
                    INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
                INTERSECTED = intersects[0].object;
                INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                INTERSECTED.material.emissive.setHex(0xff0000);
            }*/
        }
        createPerpendicularVectors();
        createWave();
    }, false);

    function createWave() {
        var segmentCount = 32;
        var wavegeometry = new THREE.Geometry();
        var wavematerial = new THREE.LineBasicMaterial({
            color: 0xFFFFFF
        });
        radius = 10;
        for (var i = 0; i <= segmentCount; i++) 
        	{
				var theta = (i / segmentCount) * Math.PI * 2;
				wavegeometry.vertices.push(new THREE.Vector3
					(
					 raindrop.x + radius * Math.cos(theta) * vectorA.x + radius * Math.sin(theta) * vectorB.x,
					 raindrop.y + radius * Math.cos(theta) * vectorA.y + radius * Math.sin(theta) * vectorB.y,
					 raindrop.z + radius * Math.cos(theta) * vectorA.z + radius * Math.sin(theta) * vectorB.z 
					)
				);
    	    }
        scene.add(new THREE.Line(wavegeometry,wavematerial));
    }
    function createScene(geometry, x, y, z, scale, tmap) {
        zmesh = new THREE.Mesh(geometry,new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture(tmap)
        }));
        zmesh.position.set(x, y, z);
        zmesh.scale.set(scale, scale, scale);
        meshes.push(zmesh);
        scene.add(zmesh);
    }

    function createPerpendicularVectors() {
        vectorV = new THREE.Vector3();
        vectorV.copy(raindrop);
        
        //console.log(vectorV);

        //var plane = new THREE.Plane( vectorV, planetradius );
        //console.log(plane);
		vectorA = new THREE.Vector3
		(
			 1/vectorV.x, 
			 1/vectorV.y, 
		  -2*(1/vectorV.z)
		);
		console.log(vectorA);

		//var angle = Math.PI / 4;
		//var axis = new THREE.Vector3(0,0,0).normalize();
		//vectorA.copy(vectorV);
		//vectorA.applyAxisAngle(vectorV,angle);
		
		//console.log(vectorA);
		vectorV.normalize();
		vectorA.normalize();
		console.log(vectorV);
		console.log(vectorA);
		console.log(vectorA.dot(vectorV));
        

        vectorB = new THREE.Vector3();
        vectorB.crossVectors(vectorV, vectorA);
        vectorB.normalize();
        
    }

    function randPoint() {
        return Math.random() * 2 - 1;
    }

})


//normal.z+radius*(Math.cos(theta)+Math.sin(theta))
//x=Math.cos(theta) * radius,
            //y=Math.sin(theta) * radius,
            //z0));            

            //vectorA.reflect(vectorV);

//console.log(vectorB);
        //console.log((radius*Math.cos(2)*vectorA.x + radius*Math.sin(2)*vectorB.x));
        //console.log(vectorV);
        //console.log(vectorA);	
        //console.log(vectorB);
        //vectorA.getTangent(vectorV);
        //vectorB.getTangent(vectorA);


                
        
/*vectorV = new THREE.Vector3();
        vectorV.copy(raindrop);
        //vectorV.normalize();
        console.log(vectorV);

		
		var plane = new THREE.Plane( vectorV );
		console.log(plane);
		vectorA = new THREE.Vector3();
		plane.projectPoint(vectorV, vectorA );
        vectorA.sub(vectorV);
        
		vectorV.normalize();
		vectorA.normalize();
		console.log(vectorA);
		
        vectorB = new THREE.Vector3();
        vectorB.crossVectors(vectorV, vectorA);
        vectorB.normalize();
        //console.log(vectorB);*/
/*
        vectorV = new THREE.Vector3();
        vectorV.copy(raindrop);
        vectorV.normalize();
        var plane = new THREE.Plane( vectorV );
        vectorA = new THREE.Vector3();
        console.log(vectorV);
		plane.projectPoint(vectorV, vectorA );
		console.log(vectorA);	
		vectorI = new THREE.Vector3();
		vectorI.lerpVectors( vectorV, vectorA, .5) ;
		console.log(vectorI);
		vectorB = new THREE.Vector3();
        vectorB.crossVectors(vectorI, vectorV);
        vectorB.normalize();
        console.log(vectorB);
        */