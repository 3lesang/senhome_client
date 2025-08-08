import focus from "@alpinejs/focus";
import intersect from "@alpinejs/intersect";
import persist from "@alpinejs/persist";
import type { Alpine } from "alpinejs";

export default (Alpine: Alpine) => {
  Alpine.plugin([intersect, focus, persist]);
};
