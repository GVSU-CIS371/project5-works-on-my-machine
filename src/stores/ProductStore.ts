import { defineStore } from "pinia";
import { Product, ProductDoc } from "../types/product";
import { initProducts } from "../data-init";
import db from "../firebase/init";
import {
	collection,
	setDoc,
	getDocs,
	doc,
	deleteDoc,
} from "firebase/firestore";

export const useProductStore = defineStore("ProductStore", {
	state: () => ({ products: [] } as { products: ProductDoc[] }),
	actions: {
		init() {
			const productColRef = collection(db, "ProductDoc");
			getDocs(productColRef).then((productDocSnap) => {
				if (productDocSnap.empty) {
					this.products = initProducts;
					initProducts.map(async (product) => {
						await setDoc(
							doc(db, "ProductDoc", product.id),
							product.data
						);
					});
				} else {
					this.products = productDocSnap.docs.map((docSnap) => {
						return {
							id: docSnap.id,
							data: docSnap.data(),
						};
					}) as ProductDoc[];
				}
			});
		},
		filterByCategory(category: string) {
			return this.products.filter(
				(product) => product.data.category === category
			);
		},
		filterByRating(minRating: number) {
			return this.products.filter(
				(product) => product.data.rating > minRating
			);
		},
		async removeDoc(id: string) {
			try {
				const ref = await deleteDoc(doc(db, "ProductDoc", id));
				console.log("Successfully deleted: ", ref);
				this.products = this.products.filter((product) => {
					return product.id !== id;
				});
			} catch (e) {
				console.log("ERROR: ", e);
			}
		},

		async updateDoc(productId: ProductDoc, product: Product) {
			try {
				const res = await setDoc(
					doc(db, "ProductDoc", productId.id),
					product
				);
				console.log("Successfully updated document: ", res);
				this.products = this.products.map((prod) => {
					if (prod.id === productId.id) {
						return { id: productId.id, data: product };
					}
					return prod;
				});
			} catch (e) {
				console.log("Error when updating document: ", e);
			}
		},
		async createDoc(productId: string, product: Product) {
			try {
				await setDoc(doc(db, "ProductDoc", productId), product);
				this.$patch((state) => {
					state.products.push({ id: productId, data: product });
				});
			} catch (e) {
				console.log("Error creating product: ", e);
			}
		},
	},
});
