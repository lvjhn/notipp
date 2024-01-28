
<script setup> 
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import ModalWindow from '../components/modal/ModalWindow.vue';
import { hideModal, setModal, showModal } from '../composables/useModal';
import { onMounted, onUnmounted, ref } from 'vue';
import ConfirmServerInformationModal from "./ConfirmServerInformationModal.vue";
import CAQRPairModal from "./CAQRPairModal.vue";

function handleButtonTap(buttonLabel) {
    if(buttonLabel == "close") {
        hideModal()
    }   
}


</script>

<template>
    <ModalWindow
        title="Download CA Certificate"
        class="qr-instructions-modal"
        :buttons="[ 'close' ]"
        @onButtonTap="handleButtonTap"
    >
        <template 
            v-slot:content
        >
            <div class="instruction">
                Please position your camera in front of the
                QR code and start scanning.
                <br /> <br />
                Once scanned, the certificate file will downloaded. You 
                still need to manually install the cerificate on your phone.

                <br /><br />

                <button 
                    class="btn btn-primary" 
                    style="width: 100%;"
                    @click="setModal(CAQRPairModal, {})"
                >
                    Understood, proceed.
                </button>
            </div>
        </template>
    </ModalWindow>    
</template>

<style lang="scss">
    .qr-instructions-modal {
        height: 350px;
        
        .instruction {
            font-weight: bold;
            color: grey;
            padding: 20px;
        }
    }
</style>