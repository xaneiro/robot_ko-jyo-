import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const target = process.argv[2];
const prefixes = {
  cloudflare: "/",
  "github-pages": "/robot_ko-jyo-/",
};
const publicPrefix = prefixes[target];

if (!publicPrefix) {
  throw new Error(
    `Unknown deploy target "${target ?? ""}". Use "cloudflare" or "github-pages".`,
  );
}

const html = readFileSync("dist/index.html", "utf8");
const assetReferences = [
  ...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g),
].map((match) => match[1]);
const expectedAssetPrefix = `${publicPrefix}assets/`;

if (assetReferences.length < 2) {
  throw new Error("Built index.html does not reference both JavaScript and CSS.");
}

for (const reference of assetReferences) {
  if (!reference.startsWith(expectedAssetPrefix)) {
    throw new Error(
      `Unexpected ${target} asset path "${reference}". Expected prefix "${expectedAssetPrefix}".`,
    );
  }

  const relativePath = reference.slice(publicPrefix.length);
  const builtPath = join("dist", relativePath);

  if (!existsSync(builtPath) || statSync(builtPath).size === 0) {
    throw new Error(`Referenced build artifact is missing or empty: ${builtPath}`);
  }
}

console.log(
  `Verified ${target} asset paths: ${assetReferences.join(", ")}`,
);
