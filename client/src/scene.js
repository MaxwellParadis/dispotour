import * as BABYLON from 'babylonjs';

export const createScene = (canvas, ptour) => {
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);

  var camera = new BABYLON.DeviceOrientationCamera('camera', new BABYLON.Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);
  camera.invertRotation = true;
  camera.inertia = .9;
  camera.inverseRotationSpeed = .3; 

  const spriteTour = new BABYLON.SpriteManager("tourSpriteManager", "vdi.png", 20, 500, scene); //{ width: 500, height: 500 }
  spriteTour.isPickable = true;

  var tour = ptour;
  var ltour = tour.length;
  var utour = [...new Map(tour.map(item => [item['position'], item])).values()];
  var ultour = utour.length;
  console.log(utour);

  utour.forEach((t)=>{
    t.sphere = BABYLON.Mesh.CreateSphere(t.position, 16, 2, scene);
    t.sphere.material = mat;
    t.sphere.scaling.scaleInPlace(100);
    t.sphere.setEnabled(false);
    t.sprite = new BABYLON.Sprite(t.position, spriteTour);
    t.sprite.position = new BABYLON.Vector3(t.x, t.z, t.y);;
    t.sprite.isPickable = true;
  })

  var mat = new BABYLON.StandardMaterial("360", scene);
  mat.disableLighting = true;
  mat.sideOrientation = 0;
  tour[ltour-1].texture = new BABYLON.Texture(tour[ltour-1].name, scene, undefined, false);
  mat.emissiveTexture = tour[ltour-1].texture;
  var active = utour.find(({position}) => position === tour[ltour-1].position);
  active.sphere.setEnabled(true);
  active.sprite.isVisible = false;
  

  scene.onPointerDown = function (evt) {
    var pickResult = scene.pickSprite(this.pointerX, this.pointerY);
    if (pickResult.hit) {
      active.sphere.setEnabled(false);
      active.sprite.isVisible = true;
      active = utour.find(({position}) => position === pickResult.pickedSprite.name);
      let iactive = tour.findIndex(x => x.name === active.name); 
      if(!('texture' in tour[iactive])){
        tour[iactive].texture = new BABYLON.Texture(pickResult.pickedSprite.name, scene, undefined, false); 
      } 
      mat.emissiveTexture = tour[iactive].texture;
      active.sphere.setEnabled(true);
      active.sprite.isVisible = false;
    }
  };

  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener('resize', () => {
    engine.resize();
  });

  return scene;
}


