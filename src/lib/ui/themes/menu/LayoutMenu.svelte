<script lang="ts">
  import { popup, setModeCurrent, getModeOsPrefers } from "@skeletonlabs/skeleton";
  import { layout } from "$lib/stores";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
  import { onMount } from "svelte";
  import DarkModeToggle from "./DarkModeToggle.svelte";
  import LayoutToggle from "./LayoutToggle.svelte";
  import ThemeButton from "./ThemeButton.svelte";
  import { themes } from "../styles/icon-lib";

  onMount(() => {
    // Sync lightswitch with the theme
    if (!("modeCurrent" in localStorage)) {
      setModeCurrent(getModeOsPrefers());
    }
  });

  // const themes = ["tutors", "dyslexia", "skeleton", "seafoam", "vintage"];
  layout.set("expanded");
</script>

<div class="relative">
  <button class="btn btn-sm" use:popup={{ event: "click", target: "design" }}>
    <Icon type="dark" />
    <span class="hidden text-sm font-bold lg:block">Layout <span class="pl-2 opacity-50">▾</span></span>
  </button>
  <nav class="list-nav card card-body p-4 w-56 space-y-4 shadow-lg" data-popup="design">
    <h6>Toggles</h6>
    <ul>
      <li class="option !p-0">
        <DarkModeToggle />
      </li>
      <li class="option !p-0">
        <LayoutToggle />
      </li>
    </ul>
    <hr />
    <h6>Themes</h6>
    <ul class="list">
      {#each themes as theme}
        <li class="option !p-0">
          <ThemeButton themeName={theme} />
        </li>
      {/each}
    </ul>
  </nav>
</div>
