<script setup>
import { computed, ref } from 'vue';
import { useMainStore } from '../../stores/main.store';
import { setModal, showModal } from '../../composables/useModal';
import AddServerModal from '../../modals/AddServerModal.vue';
import RemoveAllServersModal from "@/modals/RemoveAllServersModal.vue"
import UpdateServerModal from '../../modals/UpdateServerModal.vue';
import QRInstructions from '../../modals/QRInstructions.vue';
import ConnectionManager from '../../utils/ConnectionManager';
import ReadStateManager from '../../utils/ReadStateManager.js';
import { useUI } from '../../composables/useUI.js';
import { useRouter } from 'vue-router';

const store = useMainStore()

function sortedServers() {
    return filteredServers.value.sort(
        (a, b) => a.server.hostname > b.server.hostname ? 1 : -1
    )
}

const filteredServers = computed(() => {
    let servers = store.servers 

    if(searchTerm.value != "") {
        servers = 
            store
                .servers
                .filter(
                    (item) => item.server.hostname.indexOf(searchTerm.value) != -1
                )
    }


    if(filter.value == "ALL") {
        return servers
    }
    else if(filter.value == "ONLINE") {
        return servers.filter(
            item => item["client-state"].status == "ONLINE"
        )
    }
    else if(filter.value == "OFFLINE") {
        return servers.filter(
            item => item["client-state"].status == "OFFLINE"
        )
    }
    else if(filter.value == "UNPAIRED") {
        return servers.filter(
            item => item["client-state"].status == "UNPAIRED"
        )
    }
    else if(filter.value == "DISABLED") {
        return servers.filter(
            item => item["client-state"].status == "DISABLED"
        )
    }
    else if(filter.value == "ENABLED") {
        return  servers.filter(
            item => item["client-state"].status != "DISABLED"
        )
    }
    else {
        return []
    }
})

const moreOptionsIndex = ref(-1)
const filter = ref("ALL")
const searchTerm = ref("")
const router = useRouter()

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

async function update(event, index) {
    event.preventDefault() 
    event.stopPropagation()
    setModal(UpdateServerModal, {
        server: store.servers[index]
    }) 
    showModal() 
}

async function remove(event, index) {
    event.preventDefault() 
    event.stopPropagation()
    if(useUI().currentServer.value != null) {
        if(useUI().currentServer.value == store.servers[index]) {
            useUI().currentServer.value = store.servers[0]
        }
    }
    store.servers.splice(index, 1)
}

async function disable(event, index) {
    event.preventDefault() 
    event.stopPropagation()
    store.servers[index]['client-state'].status = "DISABLED"
    await ConnectionManager.disconnect(store.servers[index].server.id)
}

async function enable(event, index) {
    event.preventDefault() 
    event.stopPropagation()
    store.servers[index]['client-state'].status = "IDENTIFIED"
    await ConnectionManager.connect(store.servers[index].server.id)
}

async function handleServerItemClick(server)  {
    useUI().currentServer.value = server 
    router.push("/logs")
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
            <input 
                type="form-input" 
                placeholder="Enter search term..."
                style="padding: 5px 10px;"
                v-model="searchTerm"
            />
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
            <div 
                class="server-item" 
                v-for="server, index in sortedServers()"
                @click="handleServerItemClick(server)"
            >
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
                        <template v-if="store.unread && server.server.id in store.unread">
                            <span v-if="store.unread[server.server.id] > 0"> 
                                ({{ store.unread[server.server.id]  }})
                            </span>
                        </template>
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
                            @click="update($event, index)"
                        >
                            Update
                        </div>
                        <div 
                            class="more-options-item"
                            @click="enable($event, index)"
                            v-if="server['client-state'].status == 'DISABLED'"
                        >
                            Enable
                        </div>
                        <div 
                            class="more-options-item"
                            @click="disable($event, index)"
                            v-else
                        >
                            Disable
                        </div>
                        <div 
                            class="more-options-item"
                            @click="remove($event, index)"
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
        background-color: rgb(234, 234, 234);
        padding-top: 30px;
        padding-bottom: 50px;
        height: auto;
        margin-top: 50px;;

        .filters {
            display: flex;
            gap: 5px;

            input {
                width: 200px;
                border: 1px solid grey; 
                border-radius: 5px;
            }
        }

        .servers {
            display: flex;
            flex-direction: column; 
            gap: 10px; 
            user-select: none;

            .server-item {
                width: 80%; 
                box-shadow: 0px 0px 2px black; 
                margin: 0 auto;
                padding: 10px 15px;
                display: flex; 
                flex-direction: row;
                border-radius: 5px;
                gap: 0px;
                background-color: white;
                
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

        .server-item:active {
            opacity: 0.5;
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