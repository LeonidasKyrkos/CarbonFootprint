<template>
    <div class="chart">
        <div class="chart__headings">
            <div class="chart__heading">
                <span class="chart__heading-label">year</span>
                <span class="chart__heading-value">{{ currentYear }}</span>
            </div>
            <div class="chart__heading">
                <span class="chart__heading-label">global total</span>
                <span class="chart__heading-value">{{ globalTotal }}</span>
            </div>
        </div>
        <div
            class="chart__items-wrap"
            :style="{ height: `${sortedList.length * 30}px` }"
        >
            <ol class="chart__items">
                <li v-for="country in countries" :key="country.name">
                    <div
                        v-if="country.years[currentYear]?.carbon"
                        class="chart__item"
                        :style="{
                            transform: `translateY(${
                                getIndex(country.name) * 30
                            }px)`,
                        }"
                    >
                        <span
                            class="chart__item-background"
                            :style="{
                                transform: `scaleX(${
                                    country.years[currentYear].carbon /
                                    maxCarbon
                                })`,
                                'background-color': `${Color('#9DD8E6').darken(
                                    (195 / 20000) * getIndex(country.name)
                                )}`,
                            }"
                        ></span>
                        <span class="chart__item-name">
                            {{ country.name }}
                        </span>
                        <span class="chart__item-total">
                            {{
                                country.years[currentYear].carbon.toPrecision(5)
                            }}
                        </span>
                    </div>
                </li>
            </ol>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { Country } from "@/typings/Country";
import Color from "color";

export default defineComponent({
    name: "CarbonChart",
    setup() {
        const { state } = useStore();
        const currentYear = ref(1961);
        let interval: number | null = null;
        const countries = computed<Country[]>(() => state.countries);
        const sortedList = computed<Country[]>(() => {
            const countriesClone = [...countries.value].filter(
                (year) => year.years[currentYear.value]?.carbon
            );

            return currentYear.value
                ? countriesClone
                      .sort((a, b) => {
                          return (
                              a.years[currentYear.value].carbon -
                              b.years[currentYear.value].carbon
                          );
                      })
                      .reverse()
                : countriesClone;
        });

        const maxCarbon = computed<number>(
            () => sortedList.value[0].years[currentYear.value].carbon
        );

        const globalTotal = computed<number>(() => {
            return Math.round(
                sortedList.value.reduce((curr, prev) => {
                    return curr + prev.years[currentYear.value].carbon;
                }, 0)
            );
        });

        const incrementYear = () => {
            if (currentYear.value <= 2017) {
                currentYear.value++;
            }
        };

        const getIndex = (countryName: string): number => {
            return sortedList.value.findIndex(
                (country) => country.name === countryName
            );
        };

        const resetYear = () => {
            currentYear.value = 1961;
        };

        const resetInterval = () => {
            interval && clearInterval(interval);

            interval = setInterval(incrementYear, 1500);
        };

        onMounted(() => {
            resetInterval();
        });

        watch(countries, () => {
            resetYear();
            resetInterval();
        });

        return {
            Color,
            countries,
            currentYear,
            getIndex,
            globalTotal,
            incrementYear,
            maxCarbon,
            sortedList,
        };
    },
});
</script>

<style lang="scss" scoped>
$module: "chart";
$animationDuration: 0.3s;

.#{$module} {
    &__items-wrap {
        background-color: white;
        padding: em(70) em(72) em(70) em(67);
        margin: 0 auto;
        max-width: em(837);
        width: calc(100% - #{em(64 + 139)});
        box-sizing: content-box;
        border: 1px solid #e6e6e6;
        border-radius: em(8);

        @include mqMax(l-c) {
            padding: em(40) em(42) em(40) em(37);
            width: calc(100% - #{em(64 + 79)});
        }
    }

    &__items {
        position: relative;
    }

    &__item {
        width: 100%;
        height: em(17);
        position: absolute;
        top: 0;
        left: 0;
        transition: transform $animationDuration ease;
        display: flex;
        align-items: center;
    }

    &__item-background {
        position: absolute;
        top: 0;
        left: em(200);
        right: em(100);
        bottom: 0;
        transform-origin: left;
        transition: transform $animationDuration ease;
        border-radius: em(5);
    }

    &__item-name {
        $fz: 14;
        font-size: em($fz);
        position: relative;
        width: em(180, $fz);
        text-align: right;
        display: block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    &__item-total {
        @extend .#{$module}__item-name;

        $fz: 14;
        width: em(60, $fz);
        text-align: left;
        margin-left: auto;
    }

    &__headings {
        display: flex;
        justify-content: center;
        margin-bottom: em(57);
    }

    &__heading {
        text-align: center;
        margin: 0 em(69);
    }

    &__heading-label {
        $fz: 24;
        font-size: em($fz);
        color: #808080;
        margin-bottom: em(9, $fz);
        line-height: (29.05 / $fz);
        display: block;
    }

    &__heading-value {
        $fz: 56;
        font-size: em($fz);
        font-weight: 700;
        line-height: 67.77 / $fz;
        color: #0f6f6f;
        display: block;
    }
}
</style>
