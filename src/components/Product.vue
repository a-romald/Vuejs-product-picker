<template>
    <div class="card">
        <div class="card-body">
            <h6 class="card-title">{{ title }}</h6>
            <p>ID: {{ id }}</p>
            <p class="row">
                <span style="display:inline; width: 150px; color:blue" v-for="(option, idx) in options" :key="idx">
                    {{ option }}
                </span>
            </p>
        </div>
    </div>
</template>


<script>
export default {
    name: 'Product',
    props: {
        id: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        options: {
            type: Array,
            required: true
        },
    },
}
</script>