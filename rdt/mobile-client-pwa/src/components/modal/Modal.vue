<script setup> 
    const props = defineProps(["isShown"]) 
</script>

<template>
    <div class="app-modal" v-if="isShown.value">
        <div class="dimmer"></div>
        <slot></slot>
    </div>
</template>

<style lang="scss" >
    .app-modal {
        position: fixed;
        top: 0px; 
        left: 0px; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        width: 100%;
        height: 100%;
        z-index: 100;

        .dimmer {
            position: fixed;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            background-color: black;
            opacity: 0.9;
        }

    }
</style>