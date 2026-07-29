import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Page } from "../types";
import { generateFlutterPage, generateMain, generatePubspec, slug } from "./flutter";

export async function exportFlutterProjectZip(pages: Page[]) {
  const zip = new JSZip();
  zip.file("pubspec.yaml", generatePubspec());
  const lib = zip.folder("lib")!;
  lib.file("main.dart", generateMain(pages));
  const pagesFolder = lib.folder("pages")!;
  pages.forEach((p) => {
    pagesFolder.file(`${slug(p.name)}.dart`, generateFlutterPage(p, pages));
  });
  zip.file(
    "README.md",
    `# Generated App\n\nRun with:\n\n\`\`\`\nflutter pub get\nflutter run\n\`\`\`\n\nPages: ${pages.map((p) => p.name).join(", ")}\n`
  );
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, "generated_flutter_project.zip");
}
