<script setup> 
    import ModalWindow from '../components/Modal/ModalWindow.vue';
    import { hideModal } from '../composables/useModal.js';
</script>

<template>
    <ModalWindow
        title="Add Server"
        :buttons="['close']"
        @onButtonTap="(button) => {
            if(button == 'close') {
                hideModal()
            }
        }"
    >
        <template v-slot:content>
            Hello!
        </template>
    </ModalWindow>
</template>

<style lang="scss">

</style>