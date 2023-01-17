<script>
  import { onMount } from "svelte";
  import { createScene } from "./scene";
  import axios from "axios";
  import { exclude_internal_props } from "svelte/internal";

  const max = 49;

	var lon;
  var date;
  var scene;
  var tour = [];
  var tours = [];
	var now = new Date(), month, day, year;
  var edit = 'tour';
  var edits = {name:'image.jpg', tour:'Default', date:'', iposition:'A', vposition:'A', x:5, y:5, z:0, nx:0, ny:0, key:'APIKEY'};
  var ray = {x:0,y:0,z:0};

  function vectorRange(n,r){
    if(n > r){return r;};
    if(n < -r){return -r};
    return Math.round(n);
  }

  function handleTour(t) {
    axios.post('/api/tour', {tour: t}).then(res =>{
      tour = res.data.data;
      scene.dispose();
      scene = createScene(lon, tour, rayprint);
    })
  }

  function handleTab(mode) {
    edit = mode;
  }

  function handleUpdate(mode) {
    edits.x = vectorRange(edits.x, max); 
    edits.y = vectorRange(edits.y, max); 
    edits.z = vectorRange(edits.z, max); 
    edits.nx = vectorRange(edits.nx, max); 
    edits.ny = vectorRange(edits.ny, max); 
    edits.date =  year+'-'+month+'-'+day;
    axios.post('/api/'+mode, edits );
    edits = edits;
  }

  function getCurrent() {
    edits.name = ray.p;
    axios.post('/api/get', {name: edits.name}).then(res =>{
      console.log(res);
      let r = res.data.data[0];
      console.log(r);
      edits.name = r.name;
      edits.tour = r.tour;
      edits.x = r.x;
      edits.y = r.y;
      edits.z = r.z;
      edits.nx = r.nx;
      edits.ny = r.ny;
      edits.date = r.date.substring(0,10);
      date = edits.date;
      edits.position = r.position;
      edits = edits;
    })
  }

  function rayprint(nx,ny,nz,np){
    //console.log('rayprint');
    ray.x = nx;
    ray.y = ny;
    ray.z = nz;
    ray.p = np;
  }

  function setRay(){
    edits.x = ray.x;
    edits.y = ray.y;
    edits.z = ray.z;
    edits=edits;
  }

  function setNorth(){
    edits.nx = ray.x;
    edits.ny = ray.y;
    //let firstAngle = Math.atan2(1, 0);
    //let secondAngle = Math.atan2(ray.y, ray.x);
    //let angle = secondAngle - firstAngle;
    //angle = angle * 180 / Math.PI;
    //console.log(angle);
    //edits.n = Math.round(angle);
    edits = edits;
  }
  
  onMount(() => {
    axios.post('/api/tours').then(res =>{
      console.log(res.data);
      tours = res.data.data;
      axios.post('/api/tour', {tour: 'Default'}).then(rest => {
        tour = rest.data.data;
        scene = createScene(lon, tour, rayprint);
      })
    })
    month = '' + (now.getMonth() + 1),
        day = '' + now.getDate(),
        year = now.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    date = [year, month, day].join('-');
  });

  //{<div class='inputs'>North Rotation
  //<input type=integer min={-180} max={180} bind:value={edits.n}>
  //</div>}
</script>

<body>
  <div class="head"/>
  <canvas bind:this={lon} />
  <div class='coord'>Ray x:{ray.x} y:{ray.y} z:{ray.z} Photo:{ray.p}</div>
  <div class="base">
    <div class="base-butt">
      <button class="base-tab" on:click={()=>handleTab('tour')}>Tours</button>
      <button class="base-tab" on:click={()=>handleTab('add')}>Add</button>
      <button class="base-tab" on:click={()=>handleTab('edit')}>Edit</button>
    </div>
    <div class="base-bar">
      {#if edit === 'tour'}
        {#each tours as tour, i}
          <button class="tiles" on:click={()=>handleTour(tour.tour)}>
            {tour.tour}
            <img alt={tour.tour} class=timg src={tour.name}/>
          </button>
        {/each}
      {/if}
      {#if edit === 'edit'}
        <div class='edit-tab'>
          <div class='edits'> 
            
            <div class='inputs'>Position
              <input type=string bind:value={edits.vposition}>
            </div>

            <div class='inputs'>Position Vector
              <div class='ed-int-ar'>
                <input class='ed-int' type=number min={-max} max={max} bind:value={edits.x}>
                <input class='ed-int' type=number min={-max} max={max} bind:value={edits.y}>
                <input class='ed-int' type=number min={-max} max={max} bind:value={edits.z}>
              </div>
            </div>
          </div>

          <div class='ed-butts'>
            <button class="ed-butt" on:click={()=>handleUpdate('update')}>Add or Update</button>
            <div class='ed-butt'>
              <div class='key'>API Key</div>
              <input class='key' type=string bind:value={edits.key}>
            </div>
            <button class="ed-butt" on:click={setRay}>Use Ray Location</button>
          </div>
        </div>
      {/if}
      {#if edit === 'add'}
        <div class='edit-tab'>
          <div class='edits'>  

            <div class='inputs'>Add Image
              <input type=string bind:value={edits.name}>
            </div>

            <div class='inputs'>Tour Name
              <input type=string bind:value={edits.tour}>
            </div>

            <div class='inputs'>Position
              <input type=string bind:value={edits.iposition}>
            </div>

            <div class='inputs'>North Vector
              <div class='ed-int-ar'>
                <input class='ed-int' type=number min={-max} max={max} bind:value={edits.nx}>
                <input class='ed-int' type=number min={-max} max={max} bind:value={edits.ny}>
              </div>
            </div>
            
            <div class='inputs'>Date
              <input type=date bind:value={date}>
            </div>

            <div class='inputs'>Placeholder
              <input type=string >
            </div>
            
          </div>
          
          <div class='ed-butts'>
            <div class='ed-butts'>
              <button class="ed-butt" on:click={()=>handleUpdate('edit')}>Add or Update</button>
              <button class="ed-butt" on:click={getCurrent}>Pull Image</button>
            </div>
            <div class='ed-butt'>
              <div class='key'>API Key</div>
              <input class='key' type=string bind:value={edits.key}>
            </div>
            <button class="ed-butt" on:click={setNorth}>Use Ray North</button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</body>

