import * as React from "react"
import * as THREE from "three"
import { resolve } from "path";
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader'


// code for handling the 3D rendering of the spiroedge
export class Pane3D extends React.Component {
    private camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(45, 1920 / 1080, 1, 1000)
    private scene: THREE.Scene
    private ambientLight: THREE.AmbientLight
    private loadingManager: THREE.LoadingManager
    private renderer: THREE.WebGLRenderer
    private tick: number = 0
	private object: THREE.Group
	private lastRender: number = 0
    
    constructor(props) {
        super(props)

        // set up the scene
        this.scene = new THREE.Scene()
        this.ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.4)

        this.setCameraPosition(new THREE.Vector3(0, 0, 20))

        // this.camera.add(new THREE.PointLight(0xFFFFFF, 0.8))
        this.scene.add(this.camera)
        this.scene.add(this.ambientLight)

        this.loadingManager = new THREE.LoadingManager()
        this.loadingManager.onLoad = this.onLoad.bind(this)

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        })
        this.renderer.setPixelRatio(1)
        this.renderer.setSize(1920, 1080)

        this.loadObject("./data/pi.mtl", "./data/pi.obj").then((object: THREE.Group) => {
            this.object = object
            this.renderGL()
        })
    }

    render() {
        document.getElementById("pane3D").appendChild(this.renderer.domElement)
        return ""
    }

    renderGL() {
		let deltaTime = (performance.now() - this.lastRender) / 1000
		
		this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.renderGL.bind(this))

		this.object.setRotationFromEuler(new THREE.Euler(0, ))
		
		this.object.rotation.y += deltaTime

		this.tick++
		
		this.lastRender = performance.now()
    }

    setCameraLookAt(vector: THREE.Vector3) {
        this.camera.lookAt(vector)
        this.camera.updateProjectionMatrix()
    }
    
    setCameraPosition(position: THREE.Vector3) {
        this.camera.position.x = position.x
        this.camera.position.y = position.y
        this.camera.position.z = position.z
        this.camera.updateProjectionMatrix()
    }

    // called when we're finished loading an asset using this.loadingManager
    onLoad() {
        
    }

    loadObject(mtlFile: string, file: string) {
        let objectLoader = new OBJLoader()
        return new Promise<THREE.Group>((resolve, reject) => {
			let mtlLoader = new MTLLoader()
			mtlLoader.load(mtlFile, (materials) => {
				materials.preload()
				objectLoader.setMaterials(materials)
				objectLoader.load(file, (object: THREE.Group) => {
					this.scene.add(object)
					resolve(object)
				})
			})
        })
    }
}