<template>
    <label style="float:left; width: 80%; color: blue;">{{ name }}</label>
    <span style="float:right; width:20%;" ><input type="radio" :value="value" :name="group" v-model="checked" @change.prevent="getSelectedItem(group, value)" /></span>    
</template>


<script>
export default {
    props: {
        name: { 
            type: String, 
            default: "", 
            required: true,
        },        
        value: { 
            type: String,
            required: true ,        
        },
        group: { 
            type: String,
            required: true ,        
        },        
    },
    data() {
        return {
            checked: null,
        }
    },
    created() {
        this.emitter.on('reset-filters', (evt) => {
            this.checked = null
        })
    },    
    methods: {
        getSelectedItem(group, val) {
            const selectedFilters = this.$store.getters.sel_filters
            if ( (selectedFilters.type === undefined) && (group !== 'type') ) {
                const curMessages = ['Не указан тип транспортного средства']
                this.$store.commit('cur_messages', curMessages)
            }
            else {
                const selval = val.split('-')
                if (selval.slice(-1)[0] === 'any') {
                    if (selval[0] == 'type') {
                        this.emitter.emit('reset-filters', {})
                        this.$store.dispatch('resetAllFilters')
                    }
                    else {
                        this.$store.dispatch('removeSelectedGrop', group)
                    }
                }
                else {
                    let sel = {}
                    sel[group] = val
                    this.$store.dispatch('selectedFilters', sel)
                }
            }            
        },
    }
}
</script>
