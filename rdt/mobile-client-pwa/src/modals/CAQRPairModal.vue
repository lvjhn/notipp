<script setup> 
import ModalWindow from '../components/modal/ModalWindow.vue';
import { hideModal, modalWindow, setModal, showModal } from '../composables/useModal';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import ConfirmServerInformationModal from "./ConfirmServerInformationModal.vue";
import AddServerModal from './AddServerModal.vue';

function handleButtonTap(buttonLabel) {
    if(buttonLabel == "close") {
        if(qrScanner) {
            qrScanner.stop().then(() => {
                hideModal()
            }).catch(err => {
                console.error(err)
            })
        }
    }   
}

let qrScanner;

onMounted(async () => {
    const { Html5Qrcode } = await import("html5-qrcode");

  

    qrScanner = new Html5Qrcode("qr-scanner")
    
    qrScanner.start(
        { 
            facingMode: "environment" 
        }, 
        { 
            fps: 10, 
            qrbox: { width: 200, height: 280 } 
        }, 
        async (decodedText, decodedResult) => {
            console.log(`Code matched = ${decodedText}`, decodedResult);
            const { setModal, hideModal, showModal } = 
                await import('../composables/useModal');
            
            const isValidUrl = urlString => {
                var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
                '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
                 return !!urlPattern.test(urlString);
            }

            if(isValidUrl(decodedText)) {
                const downloadWindow = window.open(decodedText, "_blank")
            }
            
            hideModal()
            showModal(DownloadingCAQRPairModal)
        }, 
        () => {}
    );
})

onUnmounted(async () => {
    await qrScanner.stop()
})

</script>

<template>
    <ModalWindow
        title="Pair using QR"
        class="qr-pair-modal"
        :buttons="[ 'close' ]"
        @onButtonTap="handleButtonTap"
    >
        <template 
            v-slot:content
        >
            <div id="qr-scanner"></div>
        </template>
    </ModalWindow>    
</template>

<style lang="scss">
    .qr-pair-modal {
        height: 440px;

        #qr-scanner {
            height: 300px;
        }   
    }
</style>