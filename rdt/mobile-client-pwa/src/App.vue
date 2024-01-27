<script setup>
import { useRouter } from 'vue-router';
import isMobile from '../../../common/helpers/general/isMobile.js';
import NavigationRow from './components/NavigationRow.vue';
import {  navigationRowIndex } from './composables/useUI.js';
import Modal from "@/components/modal/Modal.vue"
import { modalWindow, setModal, showModal } from "./composables/useModal.js"
import ResetDataModal from './modals/ResetDataModal.vue';
import { onMounted } from 'vue';
import ConnectionManager from '@/utils/ConnectionManager.js'; 
import MessageReceiver from '@/utils/MessageReceiver.js'; 
import ReadStateManager from './utils/ReadStateManager';

const router = useRouter();

const routeItems = [
    {
        title: 'Servers',
        image: '/icons/home.png',
        route: "/"
    }, 
    {
        title: 'Logs', 
        image: '/icons/parchment.png', 
        route: "/logs"
    },
    {
        title: 'Settings',
        image: '/icons/settings.png',
        route: "/settings"
    }
]

function isBrowserMobile() {
    return isMobile(navigator.userAgent)
}

function onChangeTab(index) {
    navigationRowIndex.value = index
    router.push(routeItems[index].route)
}

onMounted(() => {
    ConnectionManager.initialize()
    MessageReceiver.start()
})

</script>

<template>
    <div class="root"> 
        <div class="is-mobile" v-if="isBrowserMobile()">    
            <div class="page">
                <router-view></router-view>
            </div> 
            <NavigationRow 
                :items="routeItems"
                :active="navigationRowIndex"
                @onChangeTab="onChangeTab"
            />
        </div>
        <div class="is-web" v-else>
            <h1>Notipp</h1>
            <hr style="border: 2px solid grey;"/>
            <h3>This app is not available on PC.</h3>
            <h4>
                Please visit this site on your mobile devices and it 
                should work as expected.
            </h4>
        </div>

        <Modal :isShown="modalWindow.isShown">
            <component 
                :is="modalWindow.component.value" 
                v-bind="modalWindow.props.value" 
            />
        </Modal>
    </div> 
</template>

<style lang="scss" scoped>
    .is-web {
        width: 1024px;
        margin: 250px auto;
    }

    .is-mobile {
        display: flex; 
        flex-direction: column;

        .navigation-row {
            position: fixed;
            bottom: 0px;
            left: 0px;
            width: 100%;
        }
    }

    .page {
        height: calc(100% - 60px);
        width: 100%;
        position: fixed;
        top: 0px;
        left: 0px;
        overflow-y: scroll;
        padding-bottom: 50px;
    }
</style>
