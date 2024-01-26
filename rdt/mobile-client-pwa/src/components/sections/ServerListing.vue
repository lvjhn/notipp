<script setup>
import { computed, ref } from 'vue';
import { useMainStore } from '../../stores/main.store';
import { setModal, showModal } from '../../composables/useModal';
import AddServerModal from '../../modals/AddServerModal.vue';
import RemoveAllServersModal from "@/modals/RemoveAllServersModal.vue"
import UpdateServerModal from '../../modals/UpdateServerModal.vue';
import QRInstructions from '../../modals/QRInstructions.vue';
import ConnectionManager from '../../utils/ConnectionManager';

const store = useMainStore()



function sortedServers() {
    return filteredServers.value.sort(
        (a, b) => a.server.hostname > b.server.hostname ? 1 : -1
    )
}

const filteredServers = computed(() => {
    if(filter.value == "ALL") {
        return store.servers
    }
    else if(filter.value == "ONLINE") {
        return store.servers.filter(
            item => item["client-state"].status == "ONLINE"
        )
    }
    else if(filter.value == "OFFLINE") {
        return store.servers.filter(
            item => item["client-state"].status == "OFFLINE"
        )
    }
    else if(filter.value == "UNPAIRED") {
        return store.servers.filter(
            item => item["client-state"].status == "UNPAIRED"
        )
    }
    else if(filter.value == "DISABLED") {
        return store.servers.filter(
            item => item["client-state"].status == "DISABLED"
        )
    }
    else if(filter.value == "ENABLED") {
        return store.servers.filter(
            item => item["client-state"].status != "DISABLED"
        )
    }
    else {
        return []
    }
})

const moreOptionsIndex = ref(-1)
const filter = ref("ALL")

function showMoreOptions(event, index) {
    event.preventDefault()
    event.stopPropagation()

    moreOptionsIndex.value = index;

    function declick() {
        moreOptionsIndex.value = -1
        window.removeEventListener("click", declick)
    }

    window.addEventListener("click", () => {
        declick()
    })
}

async function add() {
    setModal(AddServerModal, {}) 
    showModal()
}

async function pairQR() {
    setModal(QRInstructions, {}) 
    showModal()
}

async function removeAll() {
    setModal(RemoveAllServersModal, {}) 
    showModal()
}

async function update(index) {
    setModal(UpdateServerModal, {
        server: store.servers[index]
    }) 
    showModal() 
}

async function remove(index) {
    store.servers.splice(index, 1)
}

async function disable(index) {
    store.servers[index]['client-state'].status = "DISABLED"
    await ConnectionManager.disconnect(store.servers[index].server.id)
}

async function enable(index) {
    store.servers[index]['client-state'].status = "IDENTIFIED"
    await ConnectionManager.connect(store.servers[index].server.id)
}

</script>

<template>
    <div class="server-listing-component">
        <div class="controls">
            <div class="add-btn-ctr">
                <button 
                    class="add-btn btn btn-primary" 
                    @click="add()"
                >
                    + Add 
                </button>
            </div>
            <div class="pair-via-qr-ctr">
                <button 
                    class="add-btn btn btn-primary"
                    @click="pairQR()"    
                >
                     ▣ Pair by QR 
                </button>
            </div>
            <div class="remove-all-btn-ctr">
                <button 
                    class="remove-all-btn btn"
                    @click="removeAll()"
                >
                    🗑️ Remove All
                </button>
            </div>
        </div>
        <div class="filters">
            <select v-model="filter" class="form-select">
                <option value="ALL">All</option>
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline</option>
                <option value="UNPAIRED">Unpaired</option>
                <option value="DISABLED">Disabled</option>
                <option value="ENABLED">Enabled</option>
            </select>
        </div>
        <div class="servers" v-if="store.servers.length > 0">
            <div class="server-item" v-for="server, index in sortedServers()">
                <div class="status-indicator">
                    <div
                        :class="{
                            ['is-' + server['client-state'].status] : true
                        }" 
                    >   
                        &nbsp;
                    </div>
                </div>
                <div class="identifier">
                    <div class="name">
                        {{ server.server.hostname }}
                    </div>
                    <div class="address">
                        {{ server.server.ip + ":" + server.server.port }}
                    </div>
                </div>
                <div class="more-options">
                    <div 
                        class="more-options-btn" 
                        @click="(event) => showMoreOptions(event, index)"
                    >
                        <img 
                            src="/icons/more.png" 
                            height="20"
                        />
                    </div>
                    <div 
                        class="more-options-choices" 
                        v-if="moreOptionsIndex == index"
                    >
                        <div 
                            class="more-options-item"
                            @click="update(index)"
                        >
                            Update
                        </div>
                        <div 
                            class="more-options-item"
                            @click="enable(index)"
                            v-if="server['client-state'].status == 'DISABLED'"
                        >
                            Enable
                        </div>
                        <div 
                            class="more-options-item"
                            @click="disable(index)"
                            v-else
                        >
                            Disable
                        </div>
                        <div 
                            class="more-options-item"
                            @click="remove(index)"
                        >
                            Remove
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="no-servers" v-else>
            No Servers Added Currently 
        </div>
    </div>
</template>

<style lang="scss">
    .server-listing-component {
        width: 100%;
        display: flex; 
        flex-direction: column;
        gap: 10px;

        .servers {
            display: flex;
            flex-direction: column; 
            gap: 10px; 

            .server-item {
                width: 80%; 
                box-shadow: 0px 0px 2px black; 
                margin: 0 auto;
                padding: 10px 15px;
                display: flex; 
                flex-direction: row;
                border-radius: 5px;
                gap: 0px;
                
                .status-indicator {
                    width: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: start;

                    > div {
                        background-color: white;
                        border: 1px solid grey;
                        border-radius: 20px;
                        height: 15px;
                        width: 15px;
                    }

                    .is-ONLINE {
                        background-color: rgb(55, 219, 55);
                        border:none;
                    }

                    .is-OFFLINE {
                        background-color: rgb(252, 70, 70);
                        border: none;
                    }

                    .is-UNPAIRED {
                        background-color: rgb(245, 220, 107);
                        border: none;
                    }

                    .is-DISABLED {
                        background-color: rgb(131, 131, 131);
                        border: none;
                    }

                    .is-CONNECTING {
                        background-color: rgb(3, 90, 172);
                        border: none;
                    }

                    .is-IDENTIFIED {
                        background-color: rgb(151, 10, 194);
                        border: none;
                    }

                    .is-OPENED {
                        background-color: rgb(14, 191, 214);
                        border: none;
                    }
                }

                .identifier {
                    flex: 1; 

                    .name {
                        font-weight: bold;
                        font-size: 20px;
                    }

                    .address {
                        color: grey;
                    }
                }

                .more-options {
                    display: flex; 
                    align-items: center;
                    justify-content: center;
                
                    .more-options-btn:active {
                        opacity: 0.5;
                    }

                    .more-options-choices {
                        position: absolute;
                        margin-top: 120px;
                        right: 40px;
                        background-color: white;
                        border: 1px solid black;
                        display: flex;
                        flex-direction: column;
                        border-radius: 5px;;

                        > div {
                            padding: 5px 10px;
                            box-shadow: 0px 0px 1px grey;
                        }

                        > div:active {
                            background-color: rgb(234, 234, 234);
                        }

                        > div:first-child {
                            border-top-right-radius: 5px;
                            border-top-left-radius: 5px;
                        }

                        > div:last-child {
                            border-bottom-right-radius: 5px;
                            border-bottom-left-radius: 5px;
                        }
                    }
                }   
                
            }
        }

        .controls {
            width: 80%;
            margin: 0 auto;
            display: flex;
            gap: 5px;
            text-align: center;

            > div {
                flex: 1;

                button {
                    width: 100%;
                }
            }
        }

        .filters {
            width: 80%;
            margin: 0 auto;
            
            select {
                width: 100%;
            }
        }

        .no-servers {
            width: 80%;
            height: 100px;
            margin: 0 auto;
            background-color: rgb(200, 200, 200);
            color: rgb(50, 50, 50);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 5px;
            border: 2px solid grey;
        }
    }
</style>