import { copyFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const graphicsDir = join(root, "Graphics");
const publicDir = join(root, "public", "graphics");

const COPIES = [
  {
    sources: ["Pointer1.png", "Pointer1,.png", "Ponter1.png", "Pointer.png"],
    dest: "Pointer1.png",
  },
  { sources: ["Lock.png"], dest: "Lock.png" },
  { sources: ["PickFistLogo.png", "PickfistLogo.png"], dest: "PickfistLogo.png" },
];

mkdirSync(publicDir, { recursive: true });

let copied = 0;
let missing = [];

for (const { sources, dest } of COPIES) {
  const target = join(publicDir, dest);
  const source = sources
    .map((name) => join(graphicsDir, name))
    .find((path) => existsSync(path));

  if (!source) {
    missing.push(sources[0]);
    continue;
  }

  copyFileSync(source, target);
  console.log(`Synced ${source} -> ${target}`);
  copied += 1;
}

if (missing.length > 0) {
  console.log(`Missing in Graphics/: ${missing.join(", ")}`);
}

console.log(`Done. ${copied} file(s) synced to public/graphics/`);
