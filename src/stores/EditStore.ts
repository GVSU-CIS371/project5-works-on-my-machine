import { defineStore } from "pinia";

export const useEditStore = defineStore("EditStore", {
	state: () => ({ isEdit: false } as { isEdit: boolean }),
});
