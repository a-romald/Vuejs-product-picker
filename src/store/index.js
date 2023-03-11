import { createStore } from 'vuex'
import categories from '@/data/categories.json'
import products from '@/data/products.json'
import filters from '@/data/filters.json'
import groups from '@/data/groups.json'
import messages from '@/data/messages.json'


export default createStore({
  state: {
      is_loading: false,
      all_products: products,
      all_categories: categories,
      all_filters: filters,
      all_groups: groups,
      all_messages: messages,
      cur_products: null,
      cur_categories: null,
      cur_messages: null,
      cur_filters: null,
      sel_filters: {},
  },
  getters: {    
      all_categories(state) {
        return state.all_categories
      },
      all_products(state) {
        return state.all_products
      },
      all_filters(state) {
        return state.all_filters
      },
      all_groups(state) {
        return state.all_groups
      },
      all_messages(state) {
        return state.all_messages
      },
      cur_products(state) {
        return state.cur_products
      },
      cur_categories(state) {
        return state.cur_categories
      },
      cur_messages(state) {
        return state.cur_messages
      },
      cur_filters(state) {
        return state.cur_filters
      },      
      sel_filters(state) {
        return state.sel_filters
      },
      is_loading(state) {
        return state.is_loading
      }
  },
  mutations: {
      cur_products(state, payload) {      
        state.cur_products = payload
      },
      cur_categories(state, payload) {     
        state.cur_categories = payload
      },
      cur_messages(state, payload) {     
        state.cur_messages = payload
      },
      cur_filters(state, payload) {
        state.cur_filters = payload
      },
      sel_filters(state, payload) {        
        Object.assign(state.sel_filters, payload)
      },
      new_filters(state, payload) {        
        state.sel_filters = payload
      },
      start_loading(state) {
        state.is_loading = true
      },
      end_loading(state) {
        state.is_loading = false
      },
  },
  actions: {
      initialData(context) { // {commit, state}
        context.commit('start_loading')     
        setTimeout(() => {
          const allProducts = context.getters.all_products
          const allFilters = context.getters.all_filters
          const curFilters = allFilters.filter(filt => filt.group === 'type')
          const categories = allProducts.map(obj => obj.category)
          const uniqueCategories = [...new Set(categories)]
          let curCategories = {}
          const allCategories = context.state.all_categories
          uniqueCategories.forEach((cat) => {
              curCategories[cat] = allCategories[cat]
          })

          context.commit('cur_products', allProducts)
          context.commit('cur_categories', curCategories)
          context.commit('cur_filters', curFilters)
          context.commit('end_loading')
        }, 500)
      },
      selectedFilters(context, filter) {
          // Add filter to Seleted filters
          context.commit('sel_filters', filter)
          // Products for selected filters
          const selFilters = Object.values(context.getters.sel_filters)
          const allProducts = context.getters.all_products
          let curProducts = []
          allProducts.forEach((prod) => {
            let options = prod.options
            let common = false
            common = selFilters.every(sel => options.includes(sel)) // if options contain all filters
            if (common == true) {
              curProducts.push(prod)
            }
          })
          // Categories for selected filters
          const categories = curProducts.map(obj => obj.category)
          const uniqueCategories = [...new Set(categories)]
          let curCategories = {}
          const allCategories = context.getters.all_categories
          uniqueCategories.forEach((cat) => {
              curCategories[cat] = allCategories[cat]
          })
          // Filters groups for selected filters
          const allGroups = context.getters.all_groups
          const selectedFilters = context.getters.sel_filters // Object { type: "tablet", os: "android" }
          let fSets = null
          allGroups.forEach(g => {
              const cond = g.conditions
              if (JSON.stringify(selectedFilters) == JSON.stringify(cond)) { // if two objects equal
                  fSets = g.fieldSets
              }
          })
          let curFilters = []          
          const allFilters = context.getters.all_filters          
          allFilters.forEach(filt => {
              const group = filt.group
              if (fSets !== null) {
                  if (fSets.includes(group)) {
                      const idxGr = fSets.findIndex(fs => fs === group);
                      filt.position = idxGr + 1                  
                  }
                  else {
                      filt.position = -1
                  }
              }
              // Filters
              allGroups.forEach(gr => {
                  const conditions = gr.conditions
                  const conditionsKeys = Object.keys(conditions)
                  // Add filters from groups.json
                  if (Object.keys(conditions).every((key) => conditions[key] === selectedFilters[key])) { // if selectedFilters contain object conditions
                      const fieldSets = gr.fieldSets
                      const allSets = [...conditionsKeys, ...fieldSets]
                      if (allSets.includes(group)) {
                          if (!curFilters.includes(filt)) {
                              curFilters.push(filt)
                          }
                      }
                  }
              })              
          })
          curFilters.sort( (a, b) => a.position - b.position ) // sort by position property
          // Messages for unselected filters
          let curMessages = []
          const allMessages = context.getters.all_messages
          const keysSelectedFilters = Object.keys(selectedFilters)
          let currentMessages = []         
          allMessages.forEach(mes => {
              const mesConditions = mes.conditions
              const keysMesConditions = Object.keys(mesConditions)
              if ( keysMesConditions.every((key) =>  mesConditions[key] === selectedFilters[key]) ) { // if selectedFilters contain object conditions
                  const mesFieldSets = mes.fieldSets
                  const keysMesFieldSets = Object.keys(mesFieldSets)
                  const difFields = keysMesFieldSets.filter(d => !keysSelectedFilters.includes(d)) // difference in two arrays
                  difFields.forEach(df => {
                      for (const [key, value] of Object.entries(mesFieldSets)) {
                          if (df === key) {
                              currentMessages.push(value)
                          }
                      }
                  })
              }
          })
          curMessages = [...new Set([...currentMessages])]

          context.commit('cur_categories', curCategories)
          context.commit('cur_products', curProducts)
          context.commit('cur_messages', curMessages)
          context.commit('cur_filters', curFilters)
      },
      removeSelectedGrop(context, group) {
          const selectedFilters = context.getters.sel_filters
          let newFilters = {}
          for (const [prop, value] of Object.entries(selectedFilters)) {
            if (prop !== group) {
              newFilters[prop] = value
            }
          }
          // Selected filters   
          context.commit('new_filters', newFilters)
          // Products & Categories without removed filter
          const selFilters = Object.values(context.getters.sel_filters)
          const allProducts = context.getters.all_products
          let curProducts = []
          allProducts.forEach((prod) => {
            let options = prod.options
            let common = false
            common = selFilters.every(sel => options.includes(sel)) // if options contain all filters
            if (common == true) {
              curProducts.push(prod)
            }
          })
          const categories = curProducts.map(obj => obj.category)
          const uniqueCategories = [...new Set(categories)]
          let curCategories = {}
          const allCategories = context.state.all_categories
          uniqueCategories.forEach((cat) => {
              curCategories[cat] = allCategories[cat]
          })          
          const selsFilters = context.getters.sel_filters
          // Filters groups for selected filters          
          const allGroups = context.getters.all_groups          
          let fSets = null
          allGroups.forEach(g => {
              const cond = g.conditions
              if (JSON.stringify(selectedFilters) == JSON.stringify(cond)) { // if two objects equal
                  fSets = g.fieldSets
              }
          })
          let curFilters = []
          const allFilters = context.getters.all_filters
          allFilters.forEach(filt => {
              const group = filt.group
              if (fSets !== null) {
                  if (fSets.includes(group)) {
                      const idxGr = fSets.findIndex(fs => fs === group);
                      filt.position = idxGr + 1                  
                  }
                  else {
                      filt.position = -1
                  }
              }
              // Filters
              allGroups.forEach(gr => {
                  const conditions = gr.conditions
                  const conditionsKeys = Object.keys(conditions)                  
                  // Add filters from groups.json
                  if (Object.keys(conditions).every((key) =>  conditions[key] === selsFilters[key])) { // if selectedFilters contain object conditions
                      const fieldSets = gr.fieldSets
                      const allSets = [...conditionsKeys, ...fieldSets]
                      if (allSets.includes(group)) {
                          if (!curFilters.includes(filt)) {
                              curFilters.push(filt)
                          }
                      }
                  }
              })              
          })
          curFilters.sort( (a, b) => a.position - b.position ) // sort by position property
          // Messages for unselected filters
          let curMessages = []
          const allMessages = context.getters.all_messages
          const keysSelectedFilters = Object.keys(selsFilters) // selsFilters = context.getters.sel_filters
          let currentMessages = []         
          allMessages.forEach(mes => {
              const mesConditions = mes.conditions
              const keysMesConditions = Object.keys(mesConditions)
              if ( keysMesConditions.every((key) =>  mesConditions[key] === selsFilters[key]) ) { // if selectedFilters contain object conditions
                  const mesFieldSets = mes.fieldSets
                  const keysMesFieldSets = Object.keys(mesFieldSets)
                  const difFields = keysMesFieldSets.filter(d => !keysSelectedFilters.includes(d)) // difference in two arrays
                  difFields.forEach(df => {
                      for (const [key, value] of Object.entries(mesFieldSets)) {
                          if (df === key) {
                              currentMessages.push(value)
                          }
                      }
                  })
              }
          })
          curMessages = [...new Set([...currentMessages])]

          context.commit('cur_categories', curCategories)
          context.commit('cur_products', curProducts)
          context.commit('cur_messages', curMessages)
          context.commit('cur_filters', curFilters)
      },
      resetAllFilters(context) {
        const newFilters = {} // selected filters
        const curMessages = []
        const allFilters = context.getters.all_filters
        const curFilters = allFilters.filter(filt => filt.group === 'type')
        const allProducts = context.getters.all_products
        const categories = allProducts.map(obj => obj.category)
        const uniqueCategories = [...new Set(categories)]
        let curCategories = {}
        const allCategories = context.state.all_categories
        uniqueCategories.forEach((cat) => {
            curCategories[cat] = allCategories[cat]
        })        
        
        context.commit('cur_products', allProducts)
        context.commit('cur_categories', curCategories)
        context.commit('cur_messages', curMessages)
        context.commit('cur_filters', curFilters)
        context.commit('new_filters', newFilters)
      }
  },  
  modules: {
  }
})
