<script setup> 
    const props = defineProps([ "items", "active" ])
    const emit = defineEmits([ "onChangeTab" ])

    function onChangeTab(index) {
        emit("onChangeTab", index)
    }
</script>

<template>
    <div class="navigation-row">
        <div 
            v-for="item, index in items" 
            :class="{ 'is-active' : index == active }"
            @click="onChangeTab(index)"    
        >
            <div class="image">
                <img :src="item.image" width="20" />
            </div>
            <div class="title">
                {{ item.title }}
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .navigation-row {
        display: flex; 

        > div {
            flex: 1;
            text-align: center;
            background-color: rgb(21, 95, 133);
            padding: 10px 0;
            color: white;
            font-weight: bold;
        }

        .is-active {
            background-color: rgb(10, 43, 59);
        }
    }
</style>