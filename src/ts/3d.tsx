import * as React from "react"
import * as THREE from "three"
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader'


// code for handling the 3D rendering of the spiroedge
export class Pane3D extends React.Component {
    private camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(20, 900 / 350, 1, 1000)
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
		
        let light1 = new THREE.PointLight(0xFF8F8F, 1.0)
        light1.position.set(15, -10, 10)
        this.camera.add(light1)

        let light2 = new THREE.PointLight(0xFFFFFF, 1.0)
        light2.position.set(-15, 10, 10)
        this.camera.add(light2)

		this.setCameraPosition(new THREE.Vector3(-15, 7, 15))
		this.setCameraLookAt(new THREE.Vector3(0, 0, 0))

        this.scene.add(this.camera)
        this.scene.add(this.ambientLight)

        this.loadingManager = new THREE.LoadingManager()

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        })
        this.renderer.setPixelRatio(1)
        this.renderer.setSize(900, 350)

        this.loadObject("./data/pi.mtl", "./data/pi.obj").then((object: THREE.Group) => {
			this.object = object
			object.position.y = 1
			
			this.loadObject("./data/axies.mtl", "./data/axies.obj").then((object: THREE.Group) => {
				this.renderGL()
			})
        })
    }

    public render(): JSX.Element {
        document.getElementById("pane3D").appendChild(this.renderer.domElement)
        return <div>

		</div>
    }

    public renderGL(): void {
		let deltaTime = (performance.now() - this.lastRender) / 1000
		
		this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.renderGL.bind(this))

		this.tick++
		
		this.lastRender = performance.now()
	}

	public setBoardRotation(pitch: number, yaw: number, roll: number): void {
		this.object.rotation.x = pitch
		this.object.rotation.y = yaw
		this.object.rotation.z = roll
	}

    public setCameraLookAt(vector: THREE.Vector3): void {
        this.camera.lookAt(vector)
        this.camera.updateProjectionMatrix()
    }
    
    public setCameraPosition(position: THREE.Vector3): void {
        this.camera.position.x = position.x
        this.camera.position.y = position.y
        this.camera.position.z = position.z
        this.camera.updateProjectionMatrix()
	}

    private async loadObject(mtlFile: string, file: string): Promise<THREE.Group> {
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