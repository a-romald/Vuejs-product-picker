<template>
    {{ message }}
</template>


<script>
export default {
    props: {              
        message: { 
            type: String,
            required: true, 
        },        
    },    
    methods: {}
}
</script>
