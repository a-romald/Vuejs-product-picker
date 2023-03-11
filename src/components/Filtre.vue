<template>
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">{{ item.title }}</h5>
            <p class="card-text">{{ item.group }}</p>            
            <div style="clear:both;" class="row mb-2" v-for="(option, index) in item.options" :key="option.value">
                <radio :name="option.name" :value="option.value" :group="item.group"></radio>                
            </div>
        </div>
    </div>
</template>


<script>
import Radio from '@/components/Radio.vue'

export default {
    name: 'Filtre',
    components: {
        Radio,
    },    
    props: {
        item: {
            type: Object,
            required: true,
            default: () => ({}),
        },        
    },    
}
</script>
