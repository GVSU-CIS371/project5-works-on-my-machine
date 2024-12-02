<template>
    <v-container>
        <v-row>
            <v-col
                v-for="product in (products as ProductDoc[])"
                :key="product.id"
                cols="12"
                md="4"
                lg="3"
                sm="6"
            >
                <StoreItem :product="product" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import StoreItem from "./StoreItem.vue";
import { useProductStore } from "../stores/ProductStore";
import { ProductDoc } from "../types/product";

const products = useProductStore().filterByCategory("Clothing");
</script>
