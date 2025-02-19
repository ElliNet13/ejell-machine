<script lang="ts">
    import { config } from "@utils/config";
    import { Textures } from "@utils/texturePacks";
  
    let selectedPack = $config.texturePack;
  
    function changePack(packName: string) {
      Textures.instance.use(packName);
      $config.texturePack = packName;
    }
</script>

<style>
    table > tr > td:last-child > input:not([type=checkbox]) {
      width: 100%;
    }
</style>

<table>
    <tr><td>Tick Speed (ms):</td><td><input type="number" bind:value={$config.tickSpeed} /></td></tr>
    <tr><td>UI Scale:</td><td><input type="range" min="0.2" max="5" step="0.02" bind:value={$config.uiScale} /> {$config.uiScale}</td></tr>
    <tr><td>Animations:</td><td><input type="checkbox" bind:checked={$config.animation} /></td></tr>
    <tr><td>Main background:</td><td><input type="checkbox" bind:checked={$config.mainScreenBackground} /></td></tr>
    <tr><td>Keyboard-only mode:</td><td><input type="checkbox" bind:checked={$config.keyboardOnly} /></td></tr>
    <tr><td>Note sound length:</td><td><input type="number" bind:value={$config.troh} /></td></tr>
    <select bind:value={selectedPack} on:change={() => changePack(selectedPack)}>
        <option value="default">Default</option>
        <option value="googleImages">Google Images</option>
      </select>
</table>
