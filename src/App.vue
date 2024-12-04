<template>
	<v-app>
		<v-app-bar class="bg-blue-darken-4">
			<v-toolbar-title>My Online Store</v-toolbar-title>
			<v-btn
				class="mx-5"
				v-if="useEditStore().isEdit"
				prepend-icon="mdi-plus"
				variant="outlined"
			>
				New Product

				<v-dialog activator="parent" max-width="500">
					<template v-slot:default="{ isActive }">
						<v-card
							prepend-icon="mdi-plus"
							text="Add a product to the store."
							title="Create New Product"
						>
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
											v-model:model-value="
												formFields.category
											"
											:items="[
												'Electronics',
												'Clothing',
												'Groceries',
											]"
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
										label="Stock"
										control-variant="split"
										:min="0"
										:max="200"
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
											v-model:model-value="
												formFields.rating
											"
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
											<v-dialog
												activator="parent"
												max-width="340"
											>
												<template
													v-slot:default="{
														isActive,
													}"
												>
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
																@click="
																	isActive.value = false
																"
															></v-btn>
															<v-btn
																class="ml-auto"
																text="Confirm"
																color="success"
																@click="
																	isActive.value =
																		createProduct(
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

											<v-dialog
												activator="parent"
												max-width="340"
											>
												<template
													v-slot:default="{
														isActive,
													}"
												>
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
																@click="
																	isActive.value = false
																"
															></v-btn>
														</v-card-actions>
													</v-card>
												</template>
											</v-dialog>
										</v-btn>
									</v-card-actions>
								</v-container>
							</v-form>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn
									class="ml-auto"
									text="Go Back"
									color="error"
									@click="
										isActive.value = resetFormFields(
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
				class="mx-5"
				v-for="link in links"
				:key="link.text"
				:to="link.to"
				v-if="!useEditStore().isEdit"
			>
				<v-icon>{{ link.icon }}</v-icon>
				{{ link.text }}
			</v-btn>
			<v-switch
				color="info"
				value="info"
				label="Edit Mode"
				class="mx-5"
				hide-details
				:model-value="useEditStore().isEdit"
				@click="toggleEdit"
			></v-switch>
		</v-app-bar>
		<v-main class="bg-blue-lighten-5">
			<v-container v-if="useEditStore().isEdit"></v-container>
			<router-view v-slot="{ Component }">
				<transition name="shrink-explode">
					<component :is="Component" />
				</transition>
			</router-view>
		</v-main>

		<v-footer color="primary" app>
			© 2023 My Online Store. All rights reserved.
		</v-footer>
	</v-app>
</template>

<style>
.wiggle {
	animation: wiggle 0.27s infinite;
}
.wiggle:hover {
	animation: none;
	outline: 2px solid #00000018;
}
@keyframes wiggle {
	0% {
		transform: rotate(0deg);
	}
	25% {
		transform: rotate(0.2deg);
	}
	50% {
		transform: rotate(0deg);
	}
	75% {
		transform: rotate(-0.2deg);
	}
	100% {
		transform: rotate(0deg);
	}
}
</style>

<script lang="ts" setup>
import { ref } from "vue";
import { useProductStore } from "./stores/ProductStore";
import { useEditStore } from "./stores/EditStore";
import { VNumberInput } from "vuetify/labs/VNumberInput";

const links = ref([
	{ text: "Home", to: "/", icon: "mdi-home" },
	{ text: "Electronics", to: "/electronics", icon: "mdi-laptop" },
	{ text: "Clothing", to: "/clothing", icon: "mdi-tshirt-crew" },
	{ text: "Groceries", to: "/groceries", icon: "mdi-cart" },
	{ text: "Best Seller", to: "/bestseller", icon: "mdi-cash-register" },
]);

let formFields = ref({
	name: "",
	description: "",
	price: 0,
	rating: 0,
	stock: 0,
	image: "",
	category: "",
});

const resetFormFields = (isActive?: boolean) => {
	formFields.value.name = "";
	formFields.value.description = "";
	formFields.value.price = 0;
	formFields.value.rating = 0;
	formFields.value.stock = 0;
	formFields.value.image = "";
	formFields.value.category = "";
	return !isActive;
};

const createProduct = (isActive: boolean) => {
	let greatestID = 0;
	useProductStore().products.map((prod) => {
		if (parseInt(prod.id) > greatestID) {
			greatestID = parseInt(prod.id);
		}
		return prod;
	});
	greatestID++;
	const unlinkFields = { ...formFields.value };
	useProductStore().createDoc(greatestID.toString(), unlinkFields);
	useEditStore().isEdit = false;
	alert("Successfully added " + formFields.value.name + "to products!");
	resetFormFields();
	return !isActive;
};

useProductStore().init();

function toggleEdit() {
	useEditStore().isEdit = useEditStore().isEdit ? false : true;
}
</script>
