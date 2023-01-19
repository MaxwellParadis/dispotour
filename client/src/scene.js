import * as BABYLON from 'babylonjs';
//import { BabylonFileLoaderConfiguration } from 'babylonjs';

export const createScene = (canvas, ptour, rayprint) => {
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);

  var camera = new BABYLON.DeviceOrientationCamera('camera', new BABYLON.Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);
  camera.invertRotation = true;
  camera.inertia = .9;
  camera.inverseRotationSpeed = .3; 

  const spriteTour = new BABYLON.SpriteManager("tourSpriteManager", "vdi.png", 20, 500, scene); //{ width: 500, height: 500 }
  spriteTour.isPickable = true;

  //const ncon = 57.324840764;
  var tour = ptour.images;
  var ltour = tour.length;
  var utour = [...new Map(tour.map(item => [item['position'], item])).values()];
  //var ultour = utour.length;
  console.log(utour);

  var sphere = BABYLON.Mesh.CreateSphere('sky', 16, 2, scene);
  sphere.scaling.scaleInPlace(100);
  //sphere.setEnabled(false);

  var mat = new BABYLON.StandardMaterial("360", scene);
  mat.disableLighting = true;
  mat.sideOrientation = 0;
  console.log(tour[ltour-1].name);
  tour[ltour-1].texture = new BABYLON.Texture(tour[ltour-1].name, scene, undefined, false);
  mat.emissiveTexture = tour[ltour-1].texture;
  sphere.material = mat;

  //utour.forEach((t)=>{
  //  t.sprite = new BABYLON.Sprite(t.position, spriteTour);
  //  t.sprite.position = new BABYLON.Vector3(t.x, t.z, t.y);;
  //  t.sprite.isPickable = true;
  //})

  var active = utour.find(({position}) => position === tour[ltour-1].position);
  active.links = ptour.links.filter(x=> x.iposition === active.iposition);
  active.sprites = [];
  
  active.links.forEach((s,i)=>{
    active.sprites[i] = new BABYLON.Sprite(s.lposition, spriteTour);
    active.sprites[i].position = new BABYLON.Vector3(s.x, s.z, s.y);
    active.sprites[i].isPickable = true;
  })
  //active.sprite.isVisible = false;
  //active.sprite.isPickable = false;
  //sphere.rotation = new BABYLON.Vector3(0,-active.n,0);
  rayprint(0,0,0,active.name);
  //sphere.rotate(new BABYLON.Vector3(0,1,0), (-active.n)/ncon, BABYLON.Space.LOCAL);

  scene.onPointerDown = function (evt) {
    var pickResult = scene.pickSprite(this.pointerX, this.pointerY);
    if (pickResult.hit) {
      active.sprite.isVisible = true;
      active.sprite.isPickable = true;
      active = utour.find(({position}) => position === pickResult.pickedSprite.name);
      let iactive = tour.findIndex(x => x.name === active.name); 
      if(!('texture' in tour[iactive])){
        tour[iactive].texture = new BABYLON.Texture(tour[iactive].name, scene, undefined, false); 
      } 
      mat.emissiveTexture = tour[iactive].texture;
      sphere.rotation = new BABYLON.Vector3(0,-active.n,0);
      console.log(active.n);
      active.sprite.isVisible = false;
      active.sprite.isPickable = false;
    }
    let ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), null);
    let hit = scene.pickWithRay(ray);
    let x = Math.round(hit.pickedPoint._x/3);
    let z = Math.round(hit.pickedPoint._y/3);
    let y = Math.round(hit.pickedPoint._z/3);
    let i = active.name;
    rayprint(x,y,z,i);
    //console.log('x='+x+' y='+y+' z='+z);
  };

  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener('resize', () => {
    engine.resize();
  });

  return scene;
}


