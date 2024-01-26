<script setup> 

import ModalWindow from '../components/modal/ModalWindow.vue';
import { hideModal } from '../composables/useModal';

function confirm() {
    localStorage.clear()
    window.location = '/'
}

function handleButtonTap(buttonLabel) {
    if(buttonLabel == "close") {
        hideModal()
    }
}

</script>

<template>
    <ModalWindow
        class="reset-data-modal"
        title="Reset Data?"
        :buttons="[ 'close' ]"
        @onButtonTap="handleButtonTap"
    >
        <template v-slot:content>
            Do you confirm to reset the data?<br /> 
            This will reset the data reload the page.

            <div class="controls">
                <button 
                    class="btn cancel"
                    @click="hideModal()"
                >
                    Cancel
                </button>
                <button     
                    class="btn btn-primary confirm"
                    @click="confirm()"
                >
                    Reset & Reload
                </button>
            </div>
        </template>
    </ModalWindow>    
</template>

<style lang="scss">
    .reset-data-modal {
        .controls {
            margin-top: 10px; 
            display: flex; 
            flex-direction: row;
            gap: 5px;

            .cancel {
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