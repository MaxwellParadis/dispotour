import * as BABYLON from 'babylonjs';

const tourData = {};

export const createScene = (canvas, tour) => {
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);

  var camera = new BABYLON.DeviceOrientationCamera('camera', new BABYLON.Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);
  camera.invertRotation = true;
  camera.inertia = .9;
  camera.inverseRotationSpeed = .3;

  var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
  sphere.scaling.scaleInPlace(100);

  var mat = new BABYLON.StandardMaterial("", scene);
  mat.disableLighting = true;
  mat.emissiveTexture = new BABYLON.Texture("pdemo.jpg", scene, undefined, false);
  mat.sideOrientation = 0

  var mat2 = new BABYLON.StandardMaterial("", scene);
  mat2.disableLighting = true;
  mat2.emissiveTexture = new BABYLON.Texture("pdemo2.jpg", scene, undefined, false);
  mat2.sideOrientation = 0
  
  sphere.material = mat

  /*
  var dome = new BABYLON.PhotoDome(
    "testdome",
    "./img/pdemo.jpg",
    {
      resolution: 32,
      size: 1000
    },
    scene
  );
  dome.isPickable = true;
  */

  const spriteTour = new BABYLON.SpriteManager("tourSpriteManager", "vdi.png", 20, 500, scene); //{ width: 500, height: 500 }
  spriteTour.isPickable = true;

  const tm1 = new BABYLON.Sprite("pdemo.jpg", spriteTour);
  tm1.position = new BABYLON.Vector3(10, 5, 20);;
  tm1.isPickable = true;

  const tm2 = new BABYLON.Sprite("pdemo2.jpg", spriteTour);
  tm2.position = new BABYLON.Vector3(20, 5, 20);
  tm2.isPickable = true;

  scene.onPointerDown = function (evt) {
    var pickResult = scene.pickSprite(this.pointerX, this.pointerY);
    if (pickResult.hit) {
      mat.emissiveTexture = new BABYLON.Texture(pickResult.pickedSprite.name, scene, undefined, false);
      /*
      dome.dispose;
      dome = new BABYLON.PhotoDome(
        "testdome",
        "./img/"+pickResult.pickedSprite.name,
        {
          resolution: 32,
          size: 1000
        },
        scene
      );
        //pickResult.pickedSprite.angle += 0.5;
        //if(pickResult.pickedSprite.name === 'tm1'){
        //  camera.fov += .1;
        //}else{
        //  camera.fov -= .1;
        //}
        
        //alert(pickResult.pickedSprite.name);
        */
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


