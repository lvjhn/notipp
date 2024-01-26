<script setup> 
const props = defineProps([ "server" ])

import ModalWindow from '../components/modal/ModalWindow.vue';
import { hideModal } from '../composables/useModal';
import { useMainStore } from '../stores/main.store';

const store = useMainStore()

function handleButtonTap(buttonLabel) {
    if(buttonLabel == "close") {
        hideModal()
    }
}

function cancel() {
    hideModal()
}

async function removeAll() {
    await store.clearServers()
    hideModal()
}

</script>

<template>
    <ModalWindow
        class="remove-all-servers-modal"
        title="Remove all servers?"
        :buttons="[ 'close' ]"
        @onButtonTap="handleButtonTap"
    >
        <template v-slot:content>
            Are you sure you want to remove all servers?
            <div class="controls">
                <button 
                    class="btn cancel"
                    @click="hideModal()"
                >
                    Cancel
                </button>
                <button     
                    class="btn btn-primary confirm"
                    @click="removeAll()"
                >
                    Remove All
                </button>
            </div>
        </template>
    </ModalWindow>    
</template>

<style lang="scss">
    .remove-all-servers-modal {
        .controls {
            margin-top: 10px; 
            display: flex; 
            flex-direction: row;
            gap: 5px;

            .cancel {
                flex: 1;
                button {
                    width: 100%;
                }
            }

            .confirm {
                flex: 1;
                button {
                    width: 100%;
                }
            }
        }
    }
</style>