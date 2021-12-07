import { createStore } from "vuex";
import { Country, BaseCountry, BaseCountryYear } from "@/typings/Country";
import axios from "axios";

const CACHE_AGE_LIMIT = 300000;

const http = axios.create({
    baseURL: "https://api.footprintnetwork.org/v1",
    auth: {
        username: "leo-kyrkos",
        password: "1LbGJVLf9B0nDl09VCp7FQ5RopMIRPd7f4HOa5IqJqeDgf6lriO",
    },
});

export default createStore({
    state: {
        countries: [],
        currentYear: null,
    },
    actions: {
        async GET_DATA({ dispatch }) {
            const cachedData = localStorage.getItem("__altruistiq-cache__");

            if (cachedData) {
                await dispatch("UNPACK_CACHED_DATA", cachedData);

                return;
            }

            await dispatch("GET_SERVER_DATA");
        },

        async GET_SERVER_DATA({ dispatch, commit }) {
            const countries = await dispatch("GET_ALL_COUNTRIES");

            const dataByCountry = await Promise.all(
                countries.map((country: BaseCountry) =>
                    dispatch("GET_DATA_BY_COUNTRY", {
                        countryCode: country.countryCode,
                        countryName: country.countryName,
                    })
                )
            );

            dispatch("CACHE_DATA", dataByCountry);

            commit("UPDATE_COUNTRIES", dataByCountry);
        },

        async GET_ALL_COUNTRIES(): Promise<BaseCountry[]> {
            const { data } = await http.get(
                "https://api.footprintnetwork.org/v1/countries"
            );

            return data;
        },

        async GET_DATA_BY_COUNTRY(
            context,
            {
                countryCode,
                countryName,
            }: { countryCode: string; countryName: string }
        ): Promise<Country> {
            const { data }: { data: BaseCountryYear[] } = await http.get(
                `/data/${countryCode}/all/EFCpc`
            );
            const years: { [key: string]: { carbon: number } } = {};

            data.forEach((year) => {
                years[year.year] = {
                    carbon: year.carbon,
                };
            });

            return {
                name: countryName,
                years,
            };
        },

        async UNPACK_CACHED_DATA({ commit, dispatch }, cachedData: string) {
            try {
                const data = JSON.parse(cachedData);

                if (data.timestamp < new Date().getTime() - CACHE_AGE_LIMIT) {
                    throw new Error();
                }

                commit("UPDATE_COUNTRIES", data.countries);
            } catch (err) {
                console.warn(
                    "Warning: Something went wrong with our cache or it expired. Rehydrating from server"
                );

                await dispatch("GET_SERVER_DATA");
            }
        },

        CACHE_DATA(context, data) {
            const timestamp = new Date().getTime();

            localStorage.setItem(
                "__altruistiq-cache__",
                JSON.stringify({
                    timestamp,
                    countries: data,
                })
            );
        },
    },
    mutations: {
        UPDATE_COUNTRIES(state, countries) {
            state.countries = countries;
        },
    },
});
