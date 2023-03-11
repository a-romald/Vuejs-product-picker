<template>
  <h2 class="text-center mt-3">Pickup for products</h2>

  <loading v-if="is_loading"></loading>

  <div class="container mt-5 mb-5">
    <div class="row">
        <div class="col-md-3">
          <button type="button" class="btn btn-danger mt-3" @click="resetFilters">Reset All Filters</button>
          <div v-for="(message, idx) in cur_messages" :key="idx" class="mt-3 fw-bolder alert alert-danger" role="alert">            
            <message :message="message"></message>
          </div>
          <div v-for="(filter, idx) in cur_filters" :key="idx" class="mt-3"><!-- loop through array of objects -->
                <filtre :item="filter"></filtre>
          </div>          
        </div>
        <div class="col-md-9">
            <div v-if="catKeys === 0" class="mt-3 text-center"><h3>No products found</h3></div>
            <div v-for="(category, keyName) in cur_categories" :key="keyName" class="mt-3"><!-- loop through object -->
                <category :title="category" :slug="keyName"></category>
            </div>            
        </div>
    </div>    
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
import Category from '@/components/Category.vue'
import Message from '@/components/Message.vue'
import Filtre from '@/components/Filtre.vue'
import Loading from '@/components/Loading.vue'

export default {
  name: 'App',
  components: {
    Category,
    Message,
    Filtre,
    Loading,
  },  
  computed: {
    catKeys() {
        const cur_cats = this.$store.getters.cur_categories
        if (cur_cats !== null) return Object.keys(cur_cats).length; else return 0;
    },
    ...mapGetters(['cur_categories', 'cur_filters', 'cur_messages', 'is_loading']),
  },
  mounted() {
    this.$store.dispatch('initialData')
  },  
  methods: {
    resetFilters() {      
      this.emitter.emit('reset-filters', {})
      this.$store.dispatch('resetAllFilters')
    },    
  },
}
</script>
