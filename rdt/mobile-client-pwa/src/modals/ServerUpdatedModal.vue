<script setup> 
const props = defineProps([ "server" ])

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
        class="server-updated-modal"
        title="Server Updated"
        :buttons="[ 'close' ]"
        @onButtonTap="handleButtonTap"
    >
        <template v-slot:content>
            Server [<b>{{ server.server.hostname }}</b>] 
            has been successfully updated.
            <div class="controls">
                <button 
                    class="btn btn-primary"
                    @click="hideModal()"
                    style="width: 100%"
                >
                    Okay
                </button>
            </div>
        </template>
    </ModalWindow>    
</template>

<style lang="scss">
    .server-updated-modal {
        .controls {
            margin-top: 10px;
        }
    }
</style>