<template>
    <v-card>
        <v-card-item>
            <v-card-title>{{ props.product.data.name }}</v-card-title>
            <v-card-subtitle>
                {{ props.product.data.category }}</v-card-subtitle
            >
            <v-card-subtitle>
                <v-chip-group>
                    <v-chip prepend-icon="fa:fas fa-star">
                        {{ props.product.data.rating }}/5
                    </v-chip>
                    <v-chip prepend-icon="fa:fas fa-box">
                        {{ props.product.data.stock }} in stock
                    </v-chip>
                </v-chip-group>
            </v-card-subtitle>
        </v-card-item>
        <v-card-text>
            <v-img
                :src="props.product.data.image"
                aspect-ratio="1"
                width="100%"
                height="300px"
            ></v-img>
            <v-chip
                color="primary"
                variant="text"
                text-color="white"
                size="x-large"
            >
                {{
                    new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                    }).format(props.product.data.price)
                }}
            </v-chip>
            <v-card-text>{{ props.product.data.description }}</v-card-text>
            <v-chip variant="text">
                <v-rating
                    :model-value="product.data.rating"
                    :size="25"
                    color="primary"
                    active-color="primary"
                    readonly
                />
            </v-chip>
            <v-chip v-if="props.product.data.stock < 10" color="red">
                Hurry, Only {{ props.product.data.stock }} left in
                stock!</v-chip
            >
        </v-card-text>
        <v-container>
            <v-card-actions>
                <v-btn color="primary" variant="tonal">Buy Now</v-btn>
                <v-btn color="primary" variant="plain">Add to Cart</v-btn>
            </v-card-actions>
        </v-container>
    </v-card>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import { ProductDoc } from "../types/product";

const props = defineProps<{
    product: ProductDoc;
}>();
</script>
