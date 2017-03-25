require([], function() {
    // detect WebGL
    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
        throw 'WebGL Not Available'
    }
	//threejs
    var mouse = new THREE.Vector2(), INTERSECTED;
    var projector, camera, scene, renderer, mousePosition, raycaster, axisHelper;
    var ambient, directionalLight;
    var controls, clock;
    var planetgeo, planetmaterial, planet, planetRadius;
    var moongeo, moonmaterial, moon;
    var boat;
    var objects, raindropArray, raindropCount;
    var normal, zvalue, radius;
    var raindrop, wave, vectorA, vectorB, vectorV, vectorI;
    var snow, snowflake, mathPlanet;

    

    //
    init();
    animate();
    function init() {
        //create scene, projector, camera, axis, etc
        projector = new THREE.Projector();
        camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,1,1000);
        camera.position.x = 0;
        camera.position.y = 35;
        camera.position.z = 45;
        camera.lookAt = new THREE.Vector3(80,80,80);
        scene = new THREE.Scene();
        axisHelper = new THREE.AxisHelper(5);
        scene.add(axisHelper);
        raycaster = new THREE.Raycaster();
        raindrop = new THREE.Vector3();


        //create clock
        clock = new THREE.Clock();
        //controls = new THREE.TrackballControls(camera);
        //controls.movementSpeed = 100;
        //controls.lookSpeed = 0.1;


        //create light
        
        ambient = new THREE.AmbientLight(0x666666);
        directionalLight = new THREE.DirectionalLight(0xffeedd);
        directionalLight.position.set(0, 70, 100).normalize();
        scene.add(ambient);
        scene.add(directionalLight);
        


        //load model
		var loader = new THREE.JSONLoader(),
		callbackKey = function(geometry) {createScene(geometry, 4.24, 34.74, 35.68, 1)};
		loader.load("assets/boat.js", callbackKey);


        //create planet
        planetRadius = 50;
        planetgeo = new THREE.SphereBufferGeometry(planetRadius,100,100);
        planetmaterial = new THREE.MeshPhongMaterial({
            shading: THREE.SmoothShading,
            overdraw: true,
            color: 0x0077BE
        });
        planet = new THREE.Mesh(planetgeo,planetmaterial);
        scene.add(planet);
        mathPlanet = new THREE.Sphere( THREE.Vector3(0,0,0), planetRadius);


        //create moon 
        moongeo = new THREE.IcosahedronGeometry(5,1);
        moonmaterial = new THREE.MeshBasicMaterial({
            shading: THREE.SmoothShading
        });
        moon = new THREE.Mesh(moongeo,moonmaterial);
        moon.translateOnAxis(new THREE.Vector3(0,0,-70), 1);
        scene.add(moon);

		//object array
        objects = [planet, moon];
        planet.material.opacity = .5;

        //snow
		//snowflake = textureLoader.load( "assets/snowflake.png" );
        createSnow();
        
        //renderer
        renderer = new THREE.CanvasRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement); 
    }

    function animate() {
        requestAnimationFrame(animate);
        var vertices = snow.geometry.vertices;
		vertices.forEach(function (v) {
                v.y = v.y - (v.velocityY);
                v.x = v.x - (v.velocityX);
                var temp = new THREE.Vector3(v.x,v.y,v.z);
				//see if you can create a vector at the point when these points intersect with
				//the radius
				if (-.05 < mathPlanet.distanceToPoint ( temp ) && mathPlanet.distanceToPoint ( temp ) < 0)
				{
					raindrop.copy(temp);

				}
                if (v.y <= 0) v.y = 60;
                if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1;
            });
        directionalLight.rotation.x = Date.now() * 0.05;
        directionalLight.rotation.y = Date.now() * 0.1;
        directionalLight.rotation.z = Date.now() * 0.1;
        /*
        planet.rotation.x = Date.now() * 0.00005;
        planet.rotation.y = Date.now() * 0.0001;
        moon.rotation.x = Date.now() * 0.00005;
        moon.rotation.y = Date.now() * 0.0001;
        moon.rotation.z += 0.001;
      
          */
        
       	createPerpendicularVectors();
		createWave();
		
        	
        //controls.update(clock.getDelta());
        //createwave();
        renderer.render(scene, camera);

    }

    renderer.domElement.addEventListener('mousemove', function(event) {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }, false);

    renderer.domElement.addEventListener('mousedown', function(event) {
       removeEntity(wave);
       raycaster.setFromCamera(mouse, camera);
       var intersects = raycaster.intersectObjects(scene.children); //make this so it's only the planet.

       if (intersects.length > 0) 
       	   {
           raindrop = intersects[0].point;
     	   }
     	   console.log(raindrop);
       createPerpendicularVectors();
       createWave();
    }, false);

    function createWave() {
        var segmentCount = 32;
        var wavegeometry = new THREE.Geometry();
        var wavematerial = new THREE.LineBasicMaterial({
            color: 0xFFFFFF
        });
        radius = .02;
        //create a circle, call the animate function, delete the circle
        //find a way to scale it down each time
        //variables to scale: radius, raindrop vector. 
        //while something is 100%, go down to 0%
        for (var i = 0; i <= segmentCount; i++) 
        	{
				var theta = (i / segmentCount) * Math.PI * 2;
				wavegeometry.vertices.push(new THREE.Vector3
					(
					 (raindrop.x+.2) + radius * (Math.cos(theta) * vectorA.x + Math.sin(theta) * vectorB.x),
					 (raindrop.y+.2) + radius * (Math.cos(theta) * vectorA.y + Math.sin(theta) * vectorB.y),
					 (raindrop.z+.1) + radius * (Math.cos(theta) * vectorA.z + Math.sin(theta) * vectorB.z) 
					)
				);
    	    }
    	wave = new THREE.Line(wavegeometry,wavematerial);
        scene.add(wave);
   
    }

    function createScene(geometry, x, y, z, scale) {
        zmesh = new THREE.Mesh(geometry,new THREE.MeshPhongMaterial({
        }));
        zmesh.position.set(x, y, z);
        zmesh.scale.set(scale, scale, scale);
        zmesh.rotate.x(Math.Pi/2);
        //meshes.push(zmesh);
        scene.add(zmesh);
    }

    function createPerpendicularVectors() {
        vectorV = new THREE.Vector3();
        vectorV.copy(raindrop);
        
        //console.log(vectorV);

        //var plane = new THREE.Plane( vectorV, planetRadius );
        //console.log(plane);
		vectorA = new THREE.Vector3
		(
			 1/vectorV.x, 
			 1/vectorV.y, 
		  -2*(1/vectorV.z)
		);
		//console.log(vectorA);

		//var angle = Math.PI / 4;
		//var axis = new THREE.Vector3(0,0,0).normalize();
		//vectorA.copy(vectorV);
		//vectorA.applyAxisAngle(vectorV,angle);
		
		//console.log(vectorA);
		vectorV.normalize();
		vectorA.normalize();
		//console.log(vectorV);
		//console.log(vectorA);
		//console.log(vectorA.dot(vectorV));
        
        vectorB = new THREE.Vector3();
        vectorB.crossVectors(vectorV, vectorA);
        vectorB.normalize();
        
    }

    function randPoint() {
        return Math.random() * 2 - 1;
    }

    function removeEntity(object) {
		scene.remove( object );
	}

	function createSnow() {
		var snowGeometry = new THREE.Geometry();
        var snowMaterial = new THREE.PointsMaterial({ size: 0.04 });


        var range = 10;
        for (var i = 0; i < 1500; i++) {
            var points = new THREE.Vector3
            (
                (Math.random()+1) * range - range / 2,
              	(Math.random()+1) * range * 1.5,
              	(Math.random()+3.5) * range - range / 2
            );
            points.velocityY = 0.1 + Math.random() / 5;
            points.velocityX = (Math.random() - 0.5) / 3;
            snowGeometry.vertices.push(points);
        }

        snow = new THREE.Points(snowGeometry, snowMaterial);
        snow.sortParticles = true;
        scene.add(snow);
            
            
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
        /*if (INTERSECTED != intersects[0].object) {
                if (INTERSECTED)
                    INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
                INTERSECTED = intersects[0].object;
                INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                INTERSECTED.material.emissive.setHex(0xff0000);
            }*/