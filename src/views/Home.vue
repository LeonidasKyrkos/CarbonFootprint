<template>
    <article class="home">
        <div class="home__loader">
            <basic-loader v-if="loading"></basic-loader>
        </div>
        <div class="home__title">
            <heading-alpha :with-margin="true"
                >Historic global carbon footprint</heading-alpha
            >
        </div>
        <carbon-chart v-if="!loading"></carbon-chart>
    </article>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useStore } from "vuex";

import BasicLoader from "@/components/BasicLoader.vue";
import CarbonChart from "@/components/CarbonChart.vue";
import HeadingAlpha from "@/components/HeadingAlpha.vue";

export default defineComponent({
    name: "Home",
    components: {
        BasicLoader,
        CarbonChart,
        HeadingAlpha,
    },
    setup() {
        const loading = ref(false);
        const { dispatch } = useStore();

        onMounted(async () => {
            loading.value = true;

            await dispatch("GET_DATA");

            loading.value = false;
        });

        return {
            loading,
        };
    },
});
</script>

<style lang="scss" scoped>
$module: "home";

.#{$module} {
    padding: em(89) 0;

    &__title {
        text-align: center;
    }

    &__loader {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
    }
}
</style>
