import fs from "fs";
import path from "path";
import type { Creator } from "@/types/creator";

const DATA_FILE = path.join(process.cwd(), "data", "creators.json");

export function readCreators(): Creator[] {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as Creator[];
  } catch {
    return [];
  }
}

export function writeCreators(creators: Creator[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(creators, null, 2), "utf-8");
}
