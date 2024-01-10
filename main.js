import './style.css'
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import gsap from 'gsap'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import CANNON from 'cannon';

//crear escena

const scene = new THREE.Scene()

const world = new CANNON.World()

world.gravity.set(0, - 9.82, 0)

//crear ratio per la càmera
const fov = 60
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const aspect = sizes.width / sizes.height
const near = 0.1
const far = 1000

//crear la constant de la càmera la posicionam

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 20, 30);
camera.lookAt(0, 0, 0);
//crear el renderer
const renderer = new THREE.WebGLRenderer()
document.body.appendChild(renderer.domElement)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild( VRButton.createButton( renderer ) );
renderer.xr.enabled = true;

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

//coses per físiques

const sphereShape = new CANNON.Sphere(1)


const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: sphereShape
})

world.addBody(sphereBody)

const sphereGeo = new THREE.SphereGeometry()
const sphereMaterial = new THREE.MeshStandardMaterial({color: 0x00ff00});
const sphere = new THREE.Mesh(sphereGeo, sphereMaterial)

scene.add(sphere)

sphere.position.copy(sphereBody.position)

//fer que la pestanya es torni de la mida que és l'explorador actualment
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
//fer que quan es cliqui l'etiqueta s'acosti a Link

document.querySelector(".point-0").addEventListener("click", function(){
    LinkFocus();
})
//fer que quan es cliqui l'etiqueta s'acosti a Tharja

document.querySelector(".point-1").addEventListener("click", function(){
    TharjaFocus();
})
//fer que quan es cliqui l'etiqueta s'acosti a Yopuka

document.querySelector(".point-2").addEventListener("click", function(){
    YopukaFocus();
})

document.querySelector(".return").addEventListener("click", function(){
    ReturnToStart();
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

//objectes buits per posar els models damunt
const Link = new THREE.Object3D();
Link.position.x = -25;
scene.add(Link);
const Tharja = new THREE.Object3D();
scene.add(Tharja);
const Yopuka = new THREE.Object3D();
Yopuka.position.x = 25;
scene.add(Yopuka);

//punts HTML
    const points = [
        {
            position: new THREE.Vector3(-25, 0, 0),
            element: document.querySelector('.point-0')
        },
        {
            position: new THREE.Vector3(0, 0, 0),
            element: document.querySelector('.point-1')
        },
        {
            position: new THREE.Vector3(25, 0, 0),
            element: document.querySelector('.point-2')
        }
    ]

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

//cub de prova
const cubeMat = new THREE.MeshStandardMaterial({ color: 0xFF00FF });
const cubeGeo = new THREE.BoxGeometry();
const cube = new THREE.Mesh(cubeGeo, cubeMat);
cube.position.y = 0.5;
//scene.add(cube);

//constant per tal de poder moure la càmera
//const controls = new OrbitControls(camera, renderer.domElement)

//spotlight de Link
const spotLightLink = new THREE.SpotLight(0xFFFFFF, 10000, 0, Math.PI / 8)
spotLightLink.position.x = -25;
spotLightLink.position.y = 40;
spotLightLink.target = Link;

const spotLightHelperLink = new THREE.SpotLightHelper(spotLightLink);
spotLightLink.visible = false;
scene.add(spotLightLink);
//scene.add(spotLightHelperLink);

//spotlight de Tharja

const spotLightTharja = new THREE.SpotLight(0xFFFFFF, 10000, 0, Math.PI / 8)
spotLightTharja.position.y = 40;
spotLightTharja.target = Tharja;

const spotLightHelperTharja = new THREE.SpotLightHelper(spotLightTharja);
spotLightTharja.visible = false;
scene.add(spotLightTharja);
//scene.add(spotLightHelperTharja);

//spotlight de Yopuka

const spotLightYopuka = new THREE.SpotLight(0xFFFFFF, 10000, 0, Math.PI / 8)
spotLightYopuka.position.x = 25;
spotLightYopuka.position.y = 40;
spotLightYopuka.target = Yopuka;

const spotLightHelperYopuka = new THREE.SpotLightHelper(spotLightYopuka);
spotLightYopuka.visible = false;
scene.add(spotLightYopuka);
//scene.add(spotLightHelperYopuka);

//llum ambiental per poder veure fins que tot funcioni
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1)

scene.add(ambientLight);

//importar models a l'escena, col·locar-los i redimensionar-los
ImportModel("models/wakfu_fanart_-_female_iop/scene.gltf", Yopuka, 0.25)
ImportModel("models/ocarina_of_time_link/scene.gltf", Link, 0.75)
ImportModel("models/sallya/scene.gltf", Tharja, 6)

//temps per tener un loop d'animació
let Time = Date.now()

let model = null

//animacions

//tornar a posició inicial

// gsap.to(camera.position, {
//     duration: 3,
//     x: 0,
//        y: 20,
//     repeat: 0,
//     ease: "power1.in"
// })

//veure a Link

// gsap.to(camera.position, {
//     duration: 3,
//     x: -25,
//        y: 10,
//     repeat: 0,
//     ease: "power1.in"
// })

//veure a Tharja

// gsap.to(camera.position, {
//     duration: 3,
//     x: 0,
//     y: 10,
//     repeat: 0,
//     ease: "power1.in"
// })

//veure a Yopuka

// gsap.to(camera.position, {
//     duration: 3,
//     x: 25,
//     y: 10,
//     repeat: 0,
//     ease: "power1.in"
// })
// gsap.to(Link.rotation, {
//     duration: 500,
//     y: 360,
//     repeat: -1
// })

//spotLightLink.visible = true;


//funció de loop d'animació que servirà per fer que els objectes necessaris tenguin animació
AnimationLoop()

function AnimationLoop() {
    let ThisTime = Date.now()
    let deltaTime = ThisTime - Time
    Time = ThisTime
    //veure a Link
    //camera.lookAt(-25, 10, 0);
    // spotLightLink.visible = true;
    // Link.rotateY(0.001 * deltaTime);
    //veure a Tharja
    // camera.lookAt(0, 10, 0);
    // spotLightTharja.visible = true;
    //Tharja.rotateY(0.001 * deltaTime);
    //veure a Yopuka
    // camera.lookAt(25, 10, 0);
    // spotLightYopuka.visible = true;
    // Yopuka.rotateY(0.001 * deltaTime);
    for(const point of points)   {
        const screenPosition = point.position.clone()
        screenPosition.project(camera)
        const translateX = screenPosition.x * sizes.width * 0.5
        const translateY = - screenPosition.y * sizes.height * 0.5
        point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
    }
    world.step(1 / 60, deltaTime, 3)
    console.log(sphereBody.position.y)
    sphere.position.copy(sphereBody.position)
    renderer.render(scene, camera)
    renderer.setAnimationLoop( function () {
        renderer.render( scene, camera );
    } );
    
}
//funció que s'encarrega de quan fas click
const startOrientation = camera.quaternion.clone();
const LinkOrientation = Link.quaternion.clone().normalize();
const TharjaOrientation = Tharja.quaternion.clone().normalize();
const YopukaOrientation = Yopuka.quaternion.clone().normalize();

function LinkFocus(){
    gsap.to(camera.position, {
            duration: 3,
            x: -25,
            y: 10,
            repeat: 0,
            ease: "power1.in",
            onUpdate: function() {
                camera.quaternion.copy(startOrientation).slerp(LinkOrientation, this.progress());
            },
            onComplete: function(){
                gsap.set(".return", {opacity: 100});
                gsap.set("#text-0", {opacity: 100});
            }
    })
    spotLightLink.visible = true;
    gsap.to(Link.rotation, {
        duration: 500,
        y: 360,
        repeat: -1
    })
}

function TharjaFocus(){
    gsap.to(camera.position, {
        duration: 3,
        x: 0,
        y: 10,
        repeat: 0,
        ease: "power1.in",
        onUpdate: function() {
            camera.quaternion.copy(startOrientation).slerp(TharjaOrientation, this.progress());
        },
        onComplete: function(){
            gsap.set(".return", {opacity: 100});
            gsap.set("#text-1", {opacity: 100});
        }
    })
    spotLightTharja.visible = true;
    gsap.to(Tharja.rotation, {
        duration: 500,
        y: 360,
        repeat: -1
    })
}

function YopukaFocus(){
    gsap.to(camera.position, {
        duration: 3,
        x: 25,
        y: 10,
        repeat: 0,
        ease: "power1.in",
        onUpdate: function() {
            camera.quaternion.copy(startOrientation).slerp(YopukaOrientation, this.progress());
        },
        onComplete: function(){
            gsap.set(".return", {opacity: 100});
            gsap.set("#text-2", {opacity: 100});
        }
    })
    spotLightYopuka.visible = true;
    gsap.to(Yopuka.rotation, {
        duration: 500,
        y: 360,
        repeat: -1
    })
}

function ReturnToStart(){
    if(spotLightLink.visible){
        spotLightLink.visible = false
        gsap.killTweensOf(Link.rotation);
        Link.rotation.set(0, 0, 0);
        gsap.set("#text-0", {opacity: 0});
    }
    if(spotLightTharja.visible){
        spotLightTharja.visible = false
        gsap.killTweensOf(Tharja.rotation);
        Tharja.rotation.set(0, 0, 0);
        gsap.set("#text-1", {opacity: 0});
    }
    if(spotLightYopuka.visible){
        spotLightYopuka.visible = false
        gsap.killTweensOf(Yopuka.rotation);
        Yopuka.rotation.set(0, 0, 0);
        gsap.set("#text-2", {opacity: 0});
    }
    gsap.to(camera.position, {
        duration: 3,
        x: 0,
        y: 20,
        z: 30,
        repeat: 0,
        ease: "power1.in",
        onStart: function () {
            gsap.set(".return", {opacity: 0});
        },
        onUpdate: function() {
            camera.quaternion.copy(LinkOrientation).slerp(startOrientation, this.progress());
        },
        onComplete: function(){
            gsap.set("#text-2", {opacity: 0});
        }
    })
}

//crear una funció per poder importar models
function ImportModel(route, object3D, scalated) {

    const LoaderModel = new GLTFLoader();

    LoaderModel.load
        (
            route,

            function (gltf) {
                //console.log("hola");
                model = gltf.scene;
                object3D.add(model);
                model.scale.set(scalated, scalated, scalated);
            },
            function (xhr) {
                //console.log((xhr.loaled / xhr.total * 100) + "%loaded")
            },
            function (error) {
                //callback per quan hi ha un error. El podem mostrar per consola.
                //console.error(error);
            }
        )
}
