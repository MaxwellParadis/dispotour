<script>
  import { onMount } from "svelte";
  import { createScene } from "./scene";
  import axios from "axios";
    import { exclude_internal_props } from "svelte/internal";

	let lon;
  var date;
  var scene;
  var tour = [];
  var tours = [];
	let now = new Date(), month, day, year;
  const max = 99;
  var edit = false;
  var edits = {name:'image.jpg', tour:'Default', date:'', position:'A', x:5, y:5, z:0, n:0, key:'APIKEY'};
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

  function handleUpdate() {
    edits.x = vectorRange(edits.x, max); 
    edits.y = vectorRange(edits.y, max); 
    edits.z = vectorRange(edits.z, max); 
    edits.n = vectorRange(edits.n, 360); 
    edits.date =  year+'-'+month+'-'+day;
    axios.post('/api/update', edits );
    edits = edits;
  }

  function getCurrent() {
    axios.post('/api/get', {name: edits.name}).then(res =>{
      console.log(res);
      let r = res.data.data[0];
      console.log(r);
      edits.name = r.name;
      edits.tour = r.tour;
      edits.x = r.x;
      edits.y = r.y;
      edits.z = r.z;
      edits.n = r.n;
      edits.date = r.date.substring(0,10);
      date = edits.date;
      edits.position = r.position;
      edits = edits;
    })
  }

  function rayprint(nx,ny,nz,ni){
    //console.log('rayprint');
    ray.x = nx;
    ray.y = ny;
    ray.z = nz;
    ray.n = ni;
  }

  function setRay(){
    edits.x = ray.x;
    edits.y = ray.y;
    edits.z = ray.z;
    edits=edits;
  }

  function setNorth(){
    let firstAngle = Math.atan2(1, 0);
    let secondAngle = Math.atan2(ray.y, ray.x);
    let angle = secondAngle - firstAngle;
    angle = angle * 180 / Math.PI;
    console.log(angle);
    edits.n = Math.round(angle);
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
</script>

<body>
  <div class="head"/>
  <canvas bind:this={lon} />
  <div class='coord'>Ray x:{ray.x} y:{ray.y} z:{ray.z} Photo:{ray.n}</div>
  <div class="base">
    <div class="base-butt">
      <button class="base-tab" on:click={()=>handleTab(false)}>Tours</button>
      <button class="base-tab" on:click={()=>handleTab(true)}>Edit</button>
    </div>
    <div class="base-bar">
      {#if !edit}
        {#each tours as tour, i}
          <button class="tiles" on:click={()=>handleTour(tour.tour)}>
            {tour.tour}
            <img alt={tour.tour} class=timg src={tour.name}/>
          </button>
        {/each}
      {/if}
      {#if edit}
        <div class='edit-tab'>
          <div class='edits'>  
            <div class='inputs'>Tour
              <input type=string bind:value={edits.tour}>
            </div>
            
            <div class='inputs'>Image File
              <input type=string bind:value={edits.name}>
            </div>
            
            <div class='inputs'>Vector
              <div class='ed-int-ar'>
                <input class='ed-int' type=number min={-max} max={max} bind:value={edits.x}>
                <input class='ed-int' type=number min={-max} max={max} bind:value={edits.y}>
                <input class='ed-int' type=number min={-max} max={max} bind:value={edits.z}>
              </div>
            </div>
            
            <div class='inputs'>North Rotation
              <input type=integer min={-180} max={180} bind:value={edits.n}>
            </div>
            
            <div class='inputs'>Date
              <input type=date bind:value={date}>
            </div>

            <div class='inputs'>Position
              <input type=string bind:value={edits.position}>
            </div>
            
          </div>
          <div class='ed-butts'>
            <button class="ed-butt" on:click={handleUpdate}>Update Image</button>
            <button class="ed-butt" on:click={getCurrent}>Pull Image</button>
            <div class='ed-butt'>
              <div class='key'>API Key</div>
              <input class='key' type=string bind:value={edits.key}>
            </div>
            <button class="ed-butt" on:click={setRay}>Apply Ray</button>
            <button class="ed-butt" on:click={setNorth}>Ray North</button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</body>