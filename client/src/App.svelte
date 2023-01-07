<script>
  import { onMount } from "svelte";
  import { createScene } from "./scene";
  import axios from "axios";

	let lon;
  var date;
  var tours = [];
	let now = new Date(), month, day, year;
	const min = -10;
  const max = 10;
  var edit = false;
  var edits = {name:'image.jpg', tour:'Default', date:'', position:'A', x:5, y:5, z:0, n:0, key:'APIKEY'};



  function vectorRange(n,r){
    if(n > r){return r;};
    if(n < -r){return -r};
    if(r === 10){return Math.round(n*r)/r}else{
      return Math.round(n);
    };
  }

  function handleTour(tour) {
    tour.currentTarget.nextElementSibling.classList.toggle("close");
  }

  function handleTab(mode) {
    edit = mode;
  }

  function handleUpdate() {
    edits.x = vectorRange(edits.x,10); 
    edits.y = vectorRange(edits.y,10); 
    edits.z = vectorRange(edits.z,10); 
    edits.n = vectorRange(edits.n,180); 
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
      edits.position = r.position;
      edits = edits;
    })
  }
  
  
  onMount(() => {
    axios.post('/api/tours').then(x =>{
      console.log(x.data);
      tours = x.data.data;
    })
    createScene(lon);
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
  <div class="head" />
  <canvas bind:this={lon} />
  <div class="base">
    <div class="base-butt">
      <button class="base-tab" on:click={()=>handleTab(false)}>Tours</button>
      <button class="base-tab" on:click={()=>handleTab(true)}>Edit</button>
    </div>
    <div class="base-bar">
      {#if !edit}
        {#each tours as tour, i}
          <button class="tiles" on:click={handleTour}>
            {tour.name}
            <img alt={tour.name} class=timg src={tour.name}/>
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
                <input class='ed-int' type=number min={min} max={max} bind:value={edits.x}>
                <input class='ed-int' type=number min={min} max={max} bind:value={edits.y}>
                <input class='ed-int' type=number min={min} max={max} bind:value={edits.z}>
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
            <button class="ed-butt" on:click={handleUpdate}>Update</button>
            <div class='ed-butt'>
              <div class='key'>API Key</div>
              <input class='key' type=string bind:value={edits.key}>
            </div>
            <button class="ed-butt" on:click={getCurrent}>Get</button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</body>