<script lang="ts">
    import { CellGrid } from "@core/grid/cellGrid";
    import { clip } from "@utils/misc";
    import logo from "./logo.png?blob";
    import type { Stack } from "@utils/stack";
    import Overlay from "./Overlay.svelte";
    import { LevelGridProvider } from "./gridProvider/LevelGridProvider";
    import { gridProvider } from "./uiState";
    import { isWeb, quit } from "@utils/platform";
    import { config } from "@utils/config";

    const logoURL = URL.createObjectURL(logo);

    export let visible: boolean;
    export let layers: Stack<string>;

    let error = "";

    async function importClipboard() {
        const clipboardContent = await clip();
        console.time("import level code");
        const res = CellGrid.loadFromString(clipboardContent);
        console.timeEnd("import level code");

        if (res[0]) {
            layers = layers.next("editor");
            $gridProvider = new LevelGridProvider(res[1]);
        }
        else {
            error = "Your clipboard doesn't contain a valid level.";
            console.error(res);
        }
    }
    const tips = [
        "Jell Machine was inspired by Pyll Machine",
        "This project is fully free and open source",
        "Try to use keyboard shortcuts as much as you can",
        "This game has been made in over one year",
        "ElliNet13 ElliNet13 ElliNet13 ElliNet13 ElliNet13 ElliNet13 ElliNet13 ElliNet13 ElliNet13",
        "This is very epic",
        "Cell Machine > Jell Machine > EJell Machine",
        "0 players",
        "Who needs players?",
    ];
    let tip: string;
    $: if (visible) tip = tips[Math.floor(Math.random() * tips.length)];

    const isCorrectSite = isWeb || window.self === window.top || window.location.hostname !== 'cell.ellinet13.com';
</script>

<style lang="scss">
    @use "../defs.scss" as *;

    .overlay_container {
        background-color: rgba($bg-base, 0.9);
        height: 100%;
        left: 0;
        position: fixed;
        top: 0;
        z-index: 100;
        width: 100%;
    }

    .overlay {
        left: 50%;
        position: fixed;
        top: 50%;
        height: auto;
        transform: translate(-50%, -50%);
        width: 500px;
        z-index: 102;
    }

    img {
        margin-bottom: 50px;
        width: 100%;
    }

    .help_button {
        bottom: 20px;
        left: 20px;
        position: absolute;
        z-index: 102;
    }
    .tips {
        right: 5%;
        bottom: 4%;
        position: absolute;
        font-size: medium;
        color: #fff;
        font: 400 16px/18px "Roboto", sans-serif;
    }
</style>

{#if visible}
    <div class="overlay_container">
        <div class="overlay">
            <img src={logoURL} alt="Logo" />
            <button class:big="{!$config.miniMenu}" on:click={() => layers = layers.next("create")}>Create new level</button>
            <div class="space"></div>
            <button class:big="{!$config.miniMenu}" on:click={importClipboard}>Import from clipboard</button>
            <div class="space"></div>
            {#if $config.miniMenu}
                <button on:click={() => layers = layers.next("help")}>Help</button>
                {#if !isCorrectSite}
                    <button on:click={() => window.open('https://cell.ellinet13.com/', '_blank')}>Go to the official site</button>
                {/if}
            {/if}
            {#if !$config.miniMenu}
                <button class="big" on:click={() => layers = layers.next("connect")}>Connect to server</button>
            {/if}
            <div class="space"></div>
            <div class="cols">
                <button on:click={() => layers = layers.next("settings")}>Settings</button>
                {#if !$config.miniMenu}
                    <button on:click={() => layers = layers.next("mods")}>Mods</button>
                    <button on:click={() => window.open('https://github.com/ElliNet13/ejell-machine', '_blank')}>Open Github Repo</button>
                    {#if !isCorrectSite}
                        <button on:click={() => window.open('https://cell.ellinet13.com/', '_blank')}>Go to the official site</button>
                    {/if}
                {/if}
            </div>
            {#if !isWeb}
                <div class="space"></div>
                <button on:click={quit}>Quit</button>
            {/if}
        </div>
        {#if !$config.miniMenu}
            <button class="center help_button big" on:click={() => layers = layers.next("help")}>Help</button>
            <h1 class="tips">{tip}</h1>
        {/if}
    </div>
{/if}

<Overlay visible={error != ""}>
    {error}
    <div class="space"></div>
    <button class="center" on:click={() => error = ""}>Back</button>
</Overlay>
