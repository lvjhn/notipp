import { ref, shallowRef } from "vue"


export const modalWindow = {
    component : shallowRef(null), 
    props     : ref({}),
    isShown   : ref(false)
}

export const setModal = (component, props) => {
    modalWindow.component.value = component 
    modalWindow.props.value = props 
}

export const showModal = () => {
    modalWindow.isShown.value = true 
}

export const hideModal = () => {
    modalWindow.isShown.value = false 
}

export const useUI = () => {

}