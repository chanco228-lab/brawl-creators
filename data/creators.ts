import type { Creator } from "@/types/creator";
import creatorsJson from "./creators.json";

export const creators: Creator[] = creatorsJson as Creator[];

export function getCreatorById(id: string): Creator | undefined {
  return creators.find((c) => c.id === id);
}
