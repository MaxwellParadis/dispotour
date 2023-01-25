<script>
  import { onMount } from "svelte";
  import { createScene } from "./scene";
  import axios from "axios";
  import { exclude_internal_props } from "svelte/internal";

  const max = 49;

	var lon;
  var date;
  var scene;
  var now = new Date(), month, day, year;
  var mode = 'tour';

  var active = {};
  var tours = [];
  var positions = [];
  var ipos = [];
  //var ipositions = [];
  
  var edits = {name:'image.jpg', tour:'Default', date:'', iposition:'A', nx:0, ny:0, key:'APIKEY'};
  var ray = {x:0,y:0,z:0};


  function handleTab(m) {
    mode = m;
  }

  function vectorRange(n,r){
    if(n > r){return r;};
    if(n < -r){return -r};
    return Math.round(n);
  }

  function handleTour(t) {
    axios.post('/api/tour', {tour: t}).then(res =>{
      active = res.data.data;
			ipos = [...new Set(active.map(item => item.iposition))];
      //ipositions = [...new Map(active.map(item => [item['iposition'], item])).values()];
      if(scene !== undefined){scene.dispose()};
      scene = createScene(lon, active, rayprint, getLinks);
      //console.log(ipos);
    })
  }

  function handleUpdate() {
    edits.nx = vectorRange(edits.nx, max); 
    edits.ny = vectorRange(edits.ny, max); 
    edits.date =  year+'-'+month+'-'+day;
    axios.post('/api/update', edits);
    edits = edits;
  }

  function handleEdit(){
    positions.forEach((t,i)=>{
      positions[i].x = vectorRange(t.x, max); 
      positions[i].y = vectorRange(t.y, max); 
      positions[i].z = vectorRange(t.z, max);
    })
    positions = positions;
    axios.post('/api/edit', {positions: positions, key: edits.key} );
  }

  function getCurrent() {
    edits.name = ray.p;
    axios.post('/api/get', {name: edits.name}).then(res =>{
      console.log(res);
      let r = res.data.data[0];
      console.log(r);
      edits.name = r.name;
      edits.tour = r.tour;
      edits.nx = r.nx;
      edits.ny = r.ny;
      edits.date = r.date.substring(0,10);
      date = edits.date;
      edits.iposition = r.iposition;
      edits = edits;
    })
  }
   
  async function getLinks(img){
    let res = await axios.post('/api/links', {tour: img.tour, iposition: img.iposition});
    positions = res.data.data;
    console.log(positions);
    ipos.forEach((p,i)=>{
      console.log(p);
      if(!positions.some(x=> x.iposition === p )){
        positions.push({new:true,tour:img.tour,iposition:img.iposition,lposition:p,x:48,y:48,z:48});
      };
    }) 

    positions = positions;
    return(positions);
  }
  //getLinks();

  function rayprint(nx,ny,nz,np){
    //console.log('rayprint');
    ray.x = nx;
    ray.y = ny;
    ray.z = nz;
    ray.p = np;
  }

  function setRay(i){
    positions[i].x = ray.x;
    positions[i].y = ray.y;
    positions[i].z = ray.z;
    positions = positions;
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
      tours = res.data.data;
      handleTour(tours[0].tour);
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
      {#if mode === 'tour'}
        {#each tours as t, i}
          <button class="tiles" on:click={()=>handleTour(t.tour)}>
            {t.tour}
            <img alt={t.tour} class=timg src={t.name}/>
          </button>
        {/each}
      {/if}
      {#if mode === 'edit'}
        <div class='edit-tab'>
          <div class='edit-list'> 
            {#each positions as l, i}
              <div class='edit-item'>Position {positions[i].lposition} :
                  <input class='ed-int' type=number min={-max} max={max} bind:value={positions[i].x}>
                  <input class='ed-int' type=number min={-max} max={max} bind:value={positions[i].y}>
                  <input class='ed-int' type=number min={-max} max={max} bind:value={positions[i].z}>
                  <button class="ed-butt" on:click={()=>setRay(i)}>Use Ray Vector</button>
              </div>
            {/each}
          </div>

          <div class='ed-butts'>
            <div class='ed-butt'>
              <div class='key'>API Key</div>
              <input class='key' type=string bind:value={edits.key}>
            </div>
            <button class="ed-butt" on:click={handleEdit}>Update</button>
          </div>

        </div>
      {/if}
      {#if mode === 'add'}
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
                <button class="ed-butt" on:click={setNorth}>Ray</button>
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
            
            <button class="ed-butt" on:click={handleUpdate}>Add or Update</button>
            <div class='ed-butt'>
              <div class='key'>API Key</div>
              <input class='key' type=string bind:value={edits.key}>
            </div>
            <button class="ed-butt" on:click={getCurrent}>Pull Image</button>
            
          </div>
        </div>
      {/if}
    </div>
  </div>
</body>

