<script setup> 
import { computed, onMounted, ref } from "vue";
import { currentPage, useUI } from "../composables/useUI";
import { useMainStore } from "../stores/main.store.js";
import InfoField from "../components/widgets/InfoField.vue";
import axios from "axios";
import createClient from "@/utils/createClient.js"
import readableDate from "../../../../common/helpers/general/readableDate.js";
import ReadStateManager from "../utils/ReadStateManager.js";

currentPage.value = "Logs"

const store = useMainStore()

const server = useUI().currentServer ?? store.servers[0]

const notifications = ref([])
const searchTerm = ref("")
 
async function fetchNotifications(query = "", cursor = null, override = false) {
    const client = createClient(server.value, store) 
    const notifsResponse = 
        await client.get("/notifications", {
            params: {
                query: "%" + query + "%", 
                cursor: cursor 
            }
        })
    
    let notifs = notifsResponse.data.data 

    let fixedNofifs = notifs.map((item) => {
        item.data = JSON.parse(item.data) 
        return item 
    })

    if(override) {
        notifications.value = fixedNofifs
    } else {
        notifications.value = notifications.value.concat(fixedNofifs) 
    }
}

async function loadMoreNotifications() {
    const cursor = notifications.value.at(-1).id
    await fetchNotifications(searchTerm.value, cursor)     
}

function formatDate(date) {
    const parts = readableDate(date) 
    return parts.dateString + " -> " + parts.timeString
}

async function syncLastRead() {
    const client = createClient(server.value, store) 
    await client.put("/sync-last-read", {
        lastRead: notifications.value.at(0).id  
    })
    store.unread[server.value.server.id] = 0
}



onMounted(async () => {
    notifications.value = []
    await fetchNotifications()
})

</script>

<template>
    <div class="logs-page"> 
        <div class="title">
            <h1>Logs</h1>
        </div>
        <div class="has-servers" v-if="store.servers.length > 0"> 
            <div class="server-listing">
                <select class="form-select server-selection">
                    <option v-for="server in store.servers">
                        {{ server.server.hostname }}
                    </option>
                </select>
            </div>
            <div class="server-summary"> 
                <div class="image">
                    <img 
                        class="main-image" 
                        src="/icons/desktop.png"
                        width="100" 
                    />
                    <img    
                        class="sub-image" 
                        :src="'/icons/os-' + server.server.os + '.png'"
                        width="40"
                        style="margin-left: -30px;"
                    />
                </div>
                <div class="brief-info"> 
                    <div class="info-field">
                        <div class="label">
                            NAME  
                        </div>
                        <div class="value">
                            {{ server.server.hostname }}
                        </div>
                    </div>
                    <div class="info-field">
                        <div class="label">
                            IP  
                        </div>
                        <div class="value">
                            {{ server.server.ip }}
                        </div>
                    </div>
                    <div class="info-field">
                        <div class="label">
                            PORT  
                        </div>
                        <div class="value">
                            {{ server.server.port }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="other-info">
                <InfoField 
                    style="text-align: center"
                    label="ID"
                    :value="server.server.id"
                />
                <InfoField 
                    style="text-align: center"
                    label="USERNAME"
                    :value="server.notipp.username"
                />
            </div>
            <div class="notifications" v-if="server['client-state'].status == 'ONLINE'"> 
                <div class="title">
                    <b>Notifications</b>
                    <template v-if="store.unread[server.server.id] > 0">
                        ({{ store.unread[server.server.id] }} unread)
                    </template>
                </div>
                <div class="controls">
                    <div class="search-box">
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            v-model="searchTerm" 
                            @change="fetchNotifications(searchTerm, null, true)"
                        />
                    </div>
                    <div class="mark-all-as-read">
                        <button 
                            class="btn btn-primary"
                            @click="syncLastRead()"
                        >   
                            Mark All as Read
                        </button>
                    </div>
                </div>
                <div class="notifications-list">
                    <div 
                        class="notification-item"
                        v-for="notif in notifications"
                    >
                        <div class="title">
                            {{ notif.data.title }}
                        </div>
                        <div class="body" v-html="notif.data.options.body">
                        </div>
                        <div class="date">
                            {{ formatDate(new Date(notif.createdAt)) }}
                        </div>
                    </div>
                    <div class="load-more">
                        <button 
                            class="btn btn-primary"
                            style="width: 100%" 
                            @click="loadMoreNotifications()"
                        >
                            Load More
                        </button>
                    </div>
                </div>
                   
        </div>
        <div class="not-online" v-else>
            <div class="text">
                <b>Cannot fetch notifications.</b> <br />
                Server not online.
            </div> 
        </div>
        </div>
        <div class="no-servers" v-else> 
            You must add at least one server to 
            view this page.
        </div>
    </div>
</template>

<style lang="scss">
    .logs-page {
        margin: 0 20px;
        padding-top: 50px;

        > .title {
            text-align: center;
        }

        .server-summary {
            display: flex; 
            gap: 10px;
            width: 100%;
            flex-direction: row;

            .image {
                .main-image {
                    
                }
            }
            
            .brief-info {
                flex: 1;
                display: flex;
                gap: 5px; 
                flex-direction: column;

                .info-field {
                    display: flex; 
                    width: 100%;

                    .label {
                        width: 70px;
                        background-color: black; 
                        color: white;
                        padding: 5px 10px;
                        border-top-left-radius: 5px; 
                        border-bottom-left-radius: 5px;
                        display: flex; 
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                    }

                    .value {
                        flex: 1;
                        background-color: rgb(234, 234, 234);
                        color: black;
                        display: flex; 
                        align-items: center;
                        padding-left: 10px;
                        border-top-right-radius: 5px; 
                        border-bottom-right-radius: 5px;
                        border-top: 2px solid black;
                        border-right: 2px solid black;
                        border-bottom: 2px solid black;
                    }
                }
            }
        }

        .server-selection {
            margin-top: -10px;
            margin-bottom: 20px;
        }

        .other-info {
            margin-top: 20px;
            display: flex; 
            flex-direction: column;
            gap: 10px;
        }

        .no-servers {
            color: grey;
            font-weight: bold;
            border: 2px solid grey; 
            width: 90%;
            height: 65vh;
            border-radius: 8px;
            display: flex; 
            align-items: center; 
            justify-content: center;  
            margin: 0 auto;
            padding: 20px;
            text-align: center;
            background-color: rgb(234, 234, 234);
        }



        .notifications {
            margin-top: 20px;
            border-radius: 5px;
            background-color: rgb(234, 234, 234);
            padding-top: 20px; 
            padding-bottom: 50px;
            display: flex;
            gap: 10px;
            flex-direction: column;

            > * {
                margin: 0 20px; 
            }

            > .title {
                margin: 0 20px;
                font-size: 25px;
                border-bottom: 5px solid black;     
            }

            > .controls {
                display: flex;
                gap: 10px;

                .search-box {
                    flex: 1; 
                    input {
                        width: 100%;
                        padding: 5px 10px;
                    }
                }

                .mark-all-as-read {
                }

           
            }      
            
            >.notifications-list {
                padding: 15px 0px; 
                display: flex; 
                gap: 10px; 
                flex-direction: column;
        
                  
                .notification-item {
                    background-color:  white;   
                    border: 1px solid black; 
                    border-radius: 4px; 

                    .title {
                        background-color: rgb(50, 70, 80);
                        padding: 5px 10px;
                        color: white; 
                        font-weight: bold;
                    }

                    .body {
                        background-color:white;
                        padding: 5px 10px;
                        color: black; 
                        font-weight: bold;
                    }

                    .date {
                        background-color:rgb(234, 234, 234);
                        padding: 0px 10px;
                        border-top: 1px solid black;
                        color: grey; 
                        font-weight: bold;
                        font-style: italic;
                    }

                }
            }
        }


        .not-online {
            color: grey;
            border: 2px solid grey; 
            width: 90%;
            height: 20vh;
            border-radius: 8px;
            display: flex; 
            align-items: center; 
            justify-content: center;  
            margin: 20px auto;
            padding: 20px;
            text-align: center;
            background-color: rgb(234, 234, 234);
        }
    }
</style>