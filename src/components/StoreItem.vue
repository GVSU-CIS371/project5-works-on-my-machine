<template>
	<v-card v-if="!useEditStore().isEdit">
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
	<v-card v-if="useEditStore().isEdit">
		<v-col cols="auto">
			<v-btn :prepend-icon="`mdi-trash-can`" size="small" color="error">
				Delete
				<v-dialog activator="parent" max-width="340">
					<template v-slot:default="{ isActive }">
						<v-card
							prepend-icon="mdi-alert"
							text="This cannot be undone."
							title="Delete Item?"
						>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn
									class="ml-auto"
									text="Go Back"
									@click="isActive.value = false"
								></v-btn>
								<v-btn
									class="ml-auto"
									text="Delete"
									color="error"
									@click="
										isActive.value = deleteSelf(
											isActive.value
										)
									"
								></v-btn>
							</v-card-actions>
						</v-card>
					</template>
				</v-dialog>
			</v-btn>
		</v-col>
		<v-form>
			<v-card-item>
				<v-card-title
					><v-text-field
						v-model="formFields.name"
						:counter="10"
						label="Product Name"
						required
					></v-text-field
				></v-card-title>
				<v-card-subtitle>
					<v-select
						label="Category"
						v-model:model-value="formFields.category"
						:items="['Electronics', 'Clothing', 'Groceries']"
					></v-select
				></v-card-subtitle>
			</v-card-item>
			<v-card-text>
				<v-text-field
					label="Image URL"
					v-model="formFields.image"
				></v-text-field>
				<v-text-field
					label="Price"
					v-model:model-value="formFields.price"
					prefix="$"
				></v-text-field>
				<v-number-input
					v-model:model-value="formFields.stock"
					control-variant="split"
					:min="0"
					:max="200"
					label="Stock"
				></v-number-input>
				<v-textarea
					v-model="formFields.description"
					:counter="140"
					label="Description"
					required
				></v-textarea>
				<v-chip variant="text">
					<pre>Rating (click to change): </pre>
					<v-rating
						:size="25"
						color="primary"
						active-color="primary"
						v-model:model-value="formFields.rating"
					/>
				</v-chip>
			</v-card-text>
			<v-container>
				<v-card-actions>
					<v-btn
						color="success"
						variant="tonal"
						:prepend-icon="'mdi-check'"
						>Submit
						<v-dialog activator="parent" max-width="340">
							<template v-slot:default="{ isActive }">
								<v-card
									prepend-icon="mdi-check"
									text="Submit your changes."
									title="Confirm?"
								>
									<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn
											class="ml-auto"
											text="Go Back"
											@click="isActive.value = false"
										></v-btn>
										<v-btn
											class="ml-auto"
											text="Confirm"
											color="success"
											@click="
												isActive.value = acceptChanges(
													isActive.value
												)
											"
										></v-btn>
									</v-card-actions>
								</v-card>
							</template>
						</v-dialog>
					</v-btn>
					<v-btn
						color="error"
						variant="plain"
						:prepend-icon="'mdi-close'"
					>
						Reset

						<v-dialog activator="parent" max-width="340">
							<template v-slot:default="{ isActive }">
								<v-card
									prepend-icon="mdi-alert"
									text="This will reset your current changes. Click below to continue, or go back."
									title="Are You Sure?"
								>
									<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn
											class="ml-auto"
											text="I'm Sure"
											@click="
												isActive.value =
													resetFormFields(
														isActive.value
													)
											"
										></v-btn>
										<v-btn
											class="ml-auto"
											text="Go Back"
											color="error"
											@click="isActive.value = false"
										></v-btn>
									</v-card-actions>
								</v-card>
							</template>
						</v-dialog>
					</v-btn>
				</v-card-actions>
			</v-container>
		</v-form>
	</v-card>
</template>

<script lang="ts" setup>
import { defineProps, ref } from "vue";
import { Product, ProductDoc } from "../types/product";
import { useEditStore } from "../stores/EditStore";
import { useProductStore } from "../stores/ProductStore";
import { VNumberInput } from "vuetify/labs/VNumberInput";

const props = defineProps<{
	product: ProductDoc;
}>();

let formFields = ref({
	name: props.product.data.name,

	description: props.product.data.description,

	price: props.product.data.price,

	rating: props.product.data.rating,

	stock: props.product.data.stock,

	image: props.product.data.image,

	category: props.product.data.category,
});

const resetFormFields = (isActive: boolean) => {
	formFields.value.name = props.product.data.name;
	formFields.value.description = props.product.data.description;
	formFields.value.price = props.product.data.price;
	formFields.value.rating = props.product.data.rating;
	formFields.value.stock = props.product.data.stock;
	formFields.value.image = props.product.data.image;
	formFields.value.category = props.product.data.category;
	alert("Successfully reset " + formFields.value.name);
	return !isActive;
};

const deleteSelf = (isActive: boolean) => {
	useProductStore().removeDoc(props.product.id);
	alert("Successfully deleted " + formFields.value.name + "from products!");
	return !isActive;
};

const acceptChanges = (isActive: boolean) => {
	useProductStore().updateDoc(props.product, formFields.value as Product);
	alert("Successfully updated " + formFields.value.name + "!");
	return !isActive;
};
</script>
