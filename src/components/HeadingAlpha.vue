<template>
    <component
        :is="element"
        class="alpha"
        :class="{ 'with-margin': withMargin }"
        ><slot></slot
    ></component>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "HeadingAlpha",
    props: {
        element: {
            type: String,
            default: "h1",
        },
        withMargin: {
            type: Boolean,
            default: true,
        },
    },
});
</script>

<style lang="scss" scoped>
$module: "alpha";

.#{$module} {
    $fz: 48;
    font-size: em($fz);
    font-weight: 700;
    line-height: (58.09 / $fz);

    &.with-margin {
        margin-bottom: em(69, $fz);
    }
}
</style>
