<script>
  import { onMount } from "svelte";
  import { createScene } from "./scene";
	
	let now = new Date(), month, day, year;
	
  const items = [{ name: "Test", img: "pdemo2.jpg" }, { name: "Test", img: "pdemo.jpg" }, { name: "Test", img: "pdemo2.jpg" }, { name: "Test", img: "pdemo2.jpg" }];
  var edit = false;
  const edits = {name:'', file:'', date:'', x:10, y:10, z:0, n:0, tour:''};

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
          <div>
            <input type=string bind:value={edits.name}>
            <input type=string bind:value={edits.tour}>
            <input type=string bind:value={edits.img}>
            <input type=float bind:value={edits.x}>
            <input type=float bind:value={edits.y}>
            <input type=float bind:value={edits.z}>
            <input type=float bind:value={edits.n}>
            <input type=date bind:value={edits.date}>
            <button class="base-tabasdf" on:click={()=>handleUpdate}>Update</button>
          </div>
      {/if}
    </div>
  </div>
</body>