<template>
    <div class="card">
        <div class="card-body">
            <h4 class="card-title">{{ title }}</h4>
            <p class="card-text">{{ slug }}</p>                        
            <div class="row mb-2" v-for="(product, index) in products" :key="product.id">
                <product :id="product.id" :title="product.title" :options="product.options"></product>
            </div>
        </div>
    </div>
</template>


<script>
import Product from '@/components/Product.vue'

export default {
    name: 'Category',
    components: {
        Product,
    },
    props: {
        title: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
    },
    computed: {
        products() {
            const cur_items = this.$store.getters.cur_products
            if (cur_items !== null) {
                return cur_items.filter(obj => obj.category === this.slug)
            }
        }, 
    }
}
</script>
