import React, { Component } from 'react';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeWindow extends Component {

	constructor(props) {
		super(props);
		this.state = {
			height: "100px",
		}
		this.mount = null;
		this.renderRequested = false;

		this.requestRender = this.requestRender.bind(this);
	}

	componentDidMount() {
		this.sceneSetup();
		this.addCustomSceneObjects();
		this.startAnimationLoop();
		this.controls.addEventListener('change', this.requestRender);
		window.addEventListener('resize', this.handleWindowResize);
	}

	componentWillUnmount() {
		this.controls.removeEventListener('change', this.requestRender);
		window.removeEventListener('resize', this.handleWindowResize);
		window.cancelAnimationFrame(this.requestID);
		this.controls.dispose();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.showModel !== this.props.showModel) {
			this.scene.remove(this.props.model);
		}
		if (prevProps.mesh !== this.props.mesh) {
			if (prevProps.mesh) {
				prevProps.mesh.material.dispose()
				prevProps.mesh.geometry.dispose()
				this.scene.remove(prevProps.mesh)
			}
			this.scene.add(this.props.mesh)
			this.requestRender()
		}
	}

	// Standard scene setup in Three.js. Check "Creating a scene" manual for more information
	// https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
	sceneSetup = () => {
		// get container dimensions and use them for scene sizing
		const width = this.mount.clientWidth;
		const height = this.mount.clientHeight;

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x000000);
		this.camera = new THREE.PerspectiveCamera(
			75, // fov = field of view
			width / height, // aspect ratio
			0.1, // near plane
			1000 // far plane
		);
		this.camera.position.set(3, 3, 2);

		this.windowHeight = window.innerHeight;

		this.controls = new OrbitControls(this.camera, this.mount);
		this.controls.enableDamping = true;
		this.controls.update();

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(width, height);

		// https://github.com/mrdoob/three.js/issues/16747
		this.renderer.setPixelRatio(window.devicePixelRatio); // Sets the "quality" of the rendering

		const size = new THREE.Vector2();
		this.renderer.getDrawingBufferSize(size);
		this.mount.appendChild(this.renderer.domElement); // React ref
	};

	addCustomSceneObjects = () => {

		var axesHelper = new THREE.AxesHelper(1000);
		this.scene.add(axesHelper);

		const lights = [];
		lights[0] = new THREE.AmbientLight(0xffffff, 0.1);
		lights[1] = new THREE.PointLight(0xffffff, 0.5);
		lights[2] = new THREE.PointLight(0xffffff, 0.5);
		lights[3] = new THREE.PointLight(0xffffff, 0.5);

		lights[1].position.set(0, 200, 0);
		lights[2].position.set(100, 100, 100);
		lights[3].position.set(-100, -200, -100);

		this.scene.add(lights[0]);
		this.scene.add(lights[1]);
		this.scene.add(lights[2]);
		this.scene.add(lights[3]);

		this.scene.add(this.props.model);
	};

	startAnimationLoop = () => {
		this.renderRequested = false;
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
	};

	requestRender() {
		if (!this.renderRequested) {
			this.renderRequested = true;
			this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
		}
	}

	handleWindowResize = () => {
		const width = this.mount.clientWidth;
		const height = this.mount.clientHeight;

		this.renderer.setSize(width, height);
		this.camera.aspect = width / height;
		this.renderer.setSize(width, height, false);

		this.camera.updateProjectionMatrix();
		this.requestRender();
	};

	render() {
		return <div style={{ width: "100%", height: "100%" }} ref={ref => (this.mount = ref)} />;
	}
}

export default ThreeWindow;
