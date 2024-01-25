<script setup> 
    import ModalWindow from '../components/Modal/ModalWindow.vue';
</script>

<template>
    <ModalWindow
        title="Add Server"
        :buttons="['close']"
    >
        <template v-slot:content>
            Hello!
        </template>
    </ModalWindow>
</template>

<style lang="scss">

</style>