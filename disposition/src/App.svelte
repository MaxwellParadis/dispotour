<script>
  import { onMount } from "svelte";
  import { createScene } from "./scene";

  const items = [{ name: "Test", img: "pdemo2.jpg" }, { name: "Test", img: "pdemo2.jpg" }, { name: "Test", img: "pdemo2.jpg" }, { name: "Test", img: "pdemo2.jpg" }];

  function handleTour(tour) {
    t.currentTarget.nextElementSibling.classList.toggle("close");
  }

  function handleTab(mode) {
    t.currentTarget.nextElementSibling.classList.toggle("close");
  }

  function handleUpdate() {
    t.currentTarget.nextElementSibling.classList.toggle("close");
  }
  
  let lon;
  onMount(() => {
    createScene(lon);
  });
</script>

<body>
  <div class="head" />
  <canvas bind:this={lon} />
  <div class="base">
    <div class="base-butt">
      <button class="base-tab">Tours</button>
      <button class="base-tab">Edit</button>
    </div>
    <div class="base-bar">
      {#each items as item, i}
        <button class="tiles" on:click={handleTour}>
          {item.name}
          <img alt={item.name} class=timg src={item.img}/>
        </button>
      {/each}
    </div>
  </div>
</body>
