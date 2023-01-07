<script>
  import { onMount } from "svelte";
  import { createScene } from "./scene";
	
	let now = new Date(), month, day, year;
	const min = -10;
  const max = 10;
  const items = [{ name: "Test", img: "pdemo2.jpg" }, { name: "Test", img: "pdemo.jpg" }, { name: "Test", img: "pdemo2.jpg" }, { name: "Test", img: "pdemo2.jpg" }];
  var edit = false;
  const edits = {name:'', file:'', date:'', x:10, y:10, z:0, n:0, tour:'', key:''};

  function handleTour(tour) {
    tour.currentTarget.nextElementSibling.classList.toggle("close");
  }

  function handleTab(mode) {
    edit = mode;
  }

  function handleUpdate() {
    console.log(edits);
  }
  
  let lon;
  onMount(() => {
    createScene(lon);
    month = '' + (now.getMonth() + 1),
        day = '' + now.getDate(),
        year = now.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    edits.date = [year, month, day].join('-');
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
        {#each items as item, i}
          <button class="tiles" on:click={handleTour}>
            {item.name}
            <img alt={item.name} class=timg src={item.img}/>
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
              <input type=string bind:value={edits.img}>
            </div>
            
            <div class='inputs'>Vector
              <div class='ed-int-ar'>
                <input class='ed-int' type=number min={min} max={max} bind:value={edits.x}>
                <input class='ed-int' type=number min={min} max={max} bind:value={edits.y}>
                <input class='ed-int' type=number min={min} max={max} bind:value={edits.z}>
              </div>
            </div>
            
            <div class='inputs'>North Rotation
              <input type=number min={-180} max={180} bind:value={edits.n}>
            </div>
            
            <div class='inputs'>Date
              <input type=date bind:value={edits.date}>
            </div>

            <div class='inputs'>Edit Key
              <input type=string bind:value={edits.key}>
            </div>
            
          </div>
          <div class='ed-butts'>
            <button class="ed-butt" on:click={()=>handleUpdate}>Update</button>
            <button class="ed-butt" on:click={()=>handleUpdate}>Get</button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</body>