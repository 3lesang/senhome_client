import { createQueryClient } from "@/lib/queryClient";
import { atom } from "nanostores";

export const queryClient = atom(createQueryClient());
