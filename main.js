import './style.css'
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

//crear escena

const scene = new THREE.Scene()

//crear ratio per la càmera
const fov = 60
const aspect = window.innerWidth/window.innerHeight
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const near = 0.1
const far = 1000

//crear el renderer
const renderer = new THREE.WebGLRenderer()
document.body.appendChild(renderer.domElement)

//crear el cubemap

const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMap = cubeTextureLoader.load([
  'textures/environmentMaps/Studio/px.png',
  'textures/environmentMaps/Studio/nx.png',
  'textures/environmentMaps/Studio/py.png',
  'textures/environmentMaps/Studio/ny.png',
  'textures/environmentMaps/Studio/pz.png',
  'textures/environmentMaps/Studio/nz.png'
])

scene.background = environmentMap;

//fer que la pestanya es torni de la mida que és l'explorador actualment
window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth,window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//crear el carregador de textures
const textureLoader = new THREE.TextureLoader()

//assignar les rutes de les textures del pis a variables per poder-les carregar
const albedoFloor = "textures/WoodFloor/wood_floor_diff_2k.jpg"
const normalFloor = "textures/WoodFloor/wood_floor_nor_gl_2k.jpg"
const ARMFloor = "textures/WoodFloor/wood_floor_arm_2k.jpg"

//carregar les textures y guardar-les variables
const albedoFloorTexture = textureLoader.load(albedoFloor)
const normalFloorTexture = textureLoader.load(normalFloor)
const ARMFloorTexture = textureLoader.load(ARMFloor)

//crear el raycast que canviarà la mida y rotarà els objectes
const raycaster = new THREE.Raycaster()
//crear la constant del ratolí que utilitzarem per guardar la posició d'aquest
const mouse = new THREE.Vector2()

//guardar la posició del ratolí
window.addEventListener('mousemove', (event) =>{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
    console.log(mouse)
})

const clock = new THREE.Clock()

//crear una superfície per posar els objectes, amb una geometria, el material a partir de les imatges, y la rotació adequada per que sigui en terra
const planeGeo = new THREE.PlaneGeometry(100, 100)
const planeMat = new THREE.MeshStandardMaterial({
    map: albedoFloorTexture,
    normalMap: normalFloorTexture,
    aoMap: ARMFloorTexture,
    roughnessMap: ARMFloorTexture,
    metalnessMap: ARMFloorTexture
  
  });

const plane = new THREE.Mesh(planeGeo, planeMat)
plane.rotation.x = Math.PI * -0.5
plane.receiveShadow = true
scene.add(plane)

//crear la constant de la càmera la posicionam

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 15, 30);
camera.lookAt(0, 0, 0);

//cub de prova
const cubeMat = new THREE.MeshStandardMaterial({color: 0xFF00FF});
const cubeGeo = new THREE.BoxGeometry();
const cube = new THREE.Mesh(cubeGeo, cubeMat);
cube.position.y = 0.5;
//scene.add(cube);

//constant per tal de poder moure la càmera
const controls = new OrbitControls(camera, renderer.domElement)

//spotlight per il·luminar l'escena
const SpotLight = new THREE.SpotLight({color: 0x00FF00, intensity: 10000, angle: Math.PI/8})
SpotLight.position.y = 40;

const SpotLightHelper = new THREE.SpotLightHelper(SpotLight);

scene.add(SpotLight);
scene.add(SpotLightHelper);

//llum ambiental per poder veure fins que tot funcioni
const ambientLight = new THREE.AmbientLight(0xfffff, 1)

scene.add(ambientLight);

//importar models a l'escena, col·locar-los i redimensionar-los
ImportModel("models/wakfu_fanart_-_female_iop/scene.gltf", 25, 0.25)
ImportModel("models/ocarina_of_time_link/scene.gltf", -25, 0.75)
ImportModel("models/sallya/scene.gltf", 0, 6)

//temps per tener un loop d'animació
let Time = Date.now()

//variable per poder util·litzar per importar models
let model = null;

//funció de loop d'animació que servirà per fer que els objectes necessaris tenguin animació
AnimationLoop()

function AnimationLoop(){
    let ThisTime = Date.now()
    let deltaTime = ThisTime - Time
    Time = ThisTime;
    renderer.render(scene, camera)
    requestAnimationFrame(AnimationLoop)
}
//crear una funció per poder importar models
function ImportModel(route, xLocation, scalated){

    const LoaderModel = new GLTFLoader();

    LoaderModel.load
    (
        route,

        function (gltf) {
            model = gltf.scene;
            scene.add(model);
            model.position.set(xLocation, 0, 0);
            model.scale.set(scalated, scalated, scalated);
        },
        function(xhr){
            console.log ((xhr.loaled / xhr.total * 100)+ "%loaded")
        },
        function (error) {
            //callback per quan hi ha un error. El podem mostrar per consola.
            console.error(error);
        }
    )

}
