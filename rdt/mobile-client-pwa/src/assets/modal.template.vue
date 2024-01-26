<script setup> 

import ModalWindow from '../components/modal/ModalWindow.vue';
import { hideModal } from '../composables/useModal';

function handleButtonTap(buttonLabel) {
    if(buttonLabel == "close") {
        hideModal()
    }
}

</script>

<template>
    <ModalWindow
        title="[TITLE]"
        :buttons="[ 'close' ]"
        @onButtonTap="handleButtonTap"
    >
        Do you confirm to reset the data?
    </ModalWindow>    
</template>

<style lang="scss">

</style>