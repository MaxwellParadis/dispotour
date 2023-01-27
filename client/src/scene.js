import * as BABYLON from 'babylonjs';
//import { BabylonFileLoaderConfiguration } from 'babylonjs';

export const createScene = (canvas, ptour, rayprint, getLinks) => {

  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);

  var camera = new BABYLON.DeviceOrientationCamera('camera', new BABYLON.Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);
  camera.invertRotation = true;
  camera.inertia = .9;
  camera.inverseRotationSpeed = .3; 

  const spriteTour = new BABYLON.SpriteManager("tourSpriteManager", "vdi.png", 20, 500, scene); //{ width: 500, height: 500 }
  spriteTour.isPickable = true;

  //console.log(ptour);
  //const ncon = 57.324840764;
  var active = {};
  active.sprites = [];
  var ia;
  var tour = ptour;
  var ltour = tour.length;
  //var utour = [...new Map(tour.map(item => [item['iposition'], item])).values()];

  var sphere = BABYLON.Mesh.CreateSphere('sky', 16, 2, scene);
  sphere.scaling.scaleInPlace(100);

  var mat = new BABYLON.StandardMaterial("360", scene);
  mat.disableLighting = true;
  mat.sideOrientation = 0;

  //console.log(tour);
  updateScene(tour[ltour-1].iposition);

  sphere.material = mat;

  async function updateScene(picked){
    console.log(picked);
    
  
    if('name' in active){
      ia = tour.findIndex(o => o.name === active.name);
      if(active.sprites.length > 0){
        //console.log(active);
        active.sprites.forEach((s)=>{s.dispose()});
      };
      if(!('texture' in tour[ia])){
        tour[ia].texture = new BABYLON.Texture(tour[ia].name, scene, undefined, false); 
      }
    }

    ia = tour.findIndex(o => o.iposition === picked);
    //console.log(utour);
    //active = utour.find(({iposition}) => iposition === picked);
    active = tour[ia];
    tour[ia].texture = new BABYLON.Texture(tour[ia].name, scene, undefined, false);
    mat.emissiveTexture = tour[ia].texture;

    console.log(active);
    active.links = await getLinks(active);
    active.sprites = [];
    active.links.forEach((s,i)=>{
      active.sprites[i] = new BABYLON.Sprite(s.lposition, spriteTour);
      active.sprites[i].position = new BABYLON.Vector3(s.x, s.z, s.y);
      active.sprites[i].isPickable = true;
    })
    //sphere.rotation = new BABYLON.Vector3(0,-active.n,0);
  }

  rayprint(0,0,0,active.name);

  scene.onPointerDown = function (evt) {
    var pickResult = scene.pickSprite(this.pointerX, this.pointerY);
    if (pickResult.hit) {
      updateScene(pickResult.pickedSprite.name); 
    }
    let ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), null);
    let hit = scene.pickWithRay(ray);
    let x = Math.round(hit.pickedPoint._x/3);
    let z = Math.round(hit.pickedPoint._y/3);
    let y = Math.round(hit.pickedPoint._z/3);
    let i = active.name;
    rayprint(x,y,z,i);
  };

  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener('resize', () => {
    engine.resize();
  });

  return scene;
}


