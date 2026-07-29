import { Page, Widget } from "../types";

export function hexToDart(hex: string): string {
  if (!hex || hex === "transparent") return "Colors.transparent";
  const h = hex.replace("#", "").toUpperCase();
  return `Color(0xFF${h})`;
}

export function dartClassName(pageName: string): string {
  const clean = pageName.replace(/[^a-zA-Z0-9 ]/g, "").trim();
  const pascal = clean.split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
  return `${pascal || "Untitled"}Page`;
}

export function routeName(pageId: string, pages: Page[]): string {
  const idx = pages.findIndex((p) => p.id === pageId);
  const p = pages[idx];
  const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `/${slug || "page" + idx}`;
}

function esc(s: any) {
  return String(s ?? "").replace(/'/g, "\\'").replace(/\n/g, "\\n");
}

function navWrap(w: Widget, pages: Page[], inner: string): string {
  if (!w.navigateTo) return "() {}";
  const target = pages.find((p) => p.id === w.navigateTo);
  if (!target) return "() {}";
  return `() { Navigator.pushNamed(context, '${routeName(target.id, pages)}'); }`;
}

function genChild(w: Widget, indent: number, pages: Page[]): string {
  const pad = "  ".repeat(indent);
  const p = w.props || {};

  switch (w.type) {
    case "text":
      return `Text('${esc(p.text)}', style: TextStyle(fontSize: ${p.fontSize}, fontWeight: FontWeight.w${p.fontWeight}, color: ${hexToDart(p.color)}))`;

    case "textfield":
      return `TextField(decoration: InputDecoration(hintText: '${esc(p.placeholder)}', filled: true, fillColor: ${hexToDart(p.bg)}, border: OutlineInputBorder(borderRadius: BorderRadius.circular(${p.radius}))))`;

    case "textbutton":
      return `ElevatedButton(\n${pad}  onPressed: ${navWrap(w, pages, "")},\n${pad}  style: ElevatedButton.styleFrom(backgroundColor: ${hexToDart(p.bg)}, foregroundColor: ${hexToDart(p.color)}, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(${p.radius}))),\n${pad}  child: Text('${esc(p.text)}'),\n${pad})`;

    case "image":
      return `ClipRRect(borderRadius: BorderRadius.circular(${p.radius}), child: Image.network('https://picsum.photos/seed/${p.seed}/${Math.round(w.width)}/${Math.round(w.height)}', width: ${w.width}, height: ${w.height}, fit: BoxFit.cover))`;

    case "circleimage":
      return `CircleAvatar(radius: ${w.width / 2}, backgroundImage: NetworkImage('https://picsum.photos/seed/${p.seed}/100/100'))`;

    case "checkbox":
      return `Checkbox(value: ${!!p.checked}, activeColor: ${hexToDart(p.color)}, onChanged: (v) {})`;

    case "radio":
      return `Radio(value: true, groupValue: ${!!p.selected}, activeColor: ${hexToDart(p.color)}, onChanged: (v) {})`;

    case "icon":
      return `Icon(Icons.star, size: ${p.size}, color: ${hexToDart(p.color)})`;

    case "iconbutton":
      return `IconButton(icon: Icon(Icons.favorite, color: ${hexToDart(p.color)}), onPressed: ${navWrap(w, pages, "")})`;

    case "listtile":
      return `Material(\n${pad}  color: ${hexToDart(p.bg)},\n${pad}  child: ListTile(\n${pad}    leading: const Icon(Icons.person),\n${pad}    title: Text('${esc(p.title)}'),\n${pad}    subtitle: Text('${esc(p.subtitle)}'),\n${pad}    onTap: ${navWrap(w, pages, "")},\n${pad}  ),\n${pad})`;

    case "videoplayer":
      return `Container(color: ${hexToDart(p.bg)}, width: ${w.width}, height: ${w.height}, child: const Icon(Icons.play_circle_fill, color: Colors.white, size: 40))`;

    case "audioplayer":
      return `Container(color: ${hexToDart(p.bg)}, padding: const EdgeInsets.symmetric(horizontal: 12), child: Row(children: [Icon(Icons.play_arrow, color: ${hexToDart(p.accent)}), Expanded(child: Slider(value: 0.35, onChanged: (v) {}))]))`;

    case "switch":
      return `Switch(value: ${!!p.on}, activeColor: ${hexToDart(p.color)}, onChanged: (v) {})`;

    case "checkboxlist":
      return `Column(children: [${(p.items || []).map((it: string) => `CheckboxListTile(title: Text('${esc(it)}'), value: true, onChanged: (v) {})`).join(", ")}])`;

    case "divider":
      return `Divider(color: ${hexToDart(p.color)}, thickness: ${p.thickness})`;

    case "calendar":
      return `CalendarDatePicker(initialDate: DateTime.now(), firstDate: DateTime(2020), lastDate: DateTime(2030), onDateChanged: (d) {})`;

    case "dropdown":
      return `DropdownButtonFormField(items: [${(p.options || []).map((o: string) => `DropdownMenuItem(value: '${esc(o)}', child: Text('${esc(o)}'))`).join(", ")}], onChanged: (v) {})`;

    case "slider":
      return `Slider(value: ${p.value}, min: 0, max: 100, activeColor: ${hexToDart(p.color)}, onChanged: (v) {})`;

    case "lottie":
      return `Container(color: ${hexToDart(p.bg)}, child: const Center(child: Icon(Icons.auto_awesome))) /* replace with Lottie.asset(...) */`;

    case "creditcardview":
      return `Container(\n${pad}  width: ${w.width}, height: ${w.height},\n${pad}  decoration: BoxDecoration(borderRadius: BorderRadius.circular(16), gradient: LinearGradient(colors: [${hexToDart(p.bg1)}, ${hexToDart(p.bg2)}], begin: Alignment.topLeft, end: Alignment.bottomRight)),\n${pad}  padding: const EdgeInsets.all(16),\n${pad}  child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [Text('${esc(p.number)}', style: const TextStyle(color: Colors.white)), Text('${esc(p.holder)}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold))]),\n${pad})`;

    case "otptextfield":
      return `Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: List.generate(${p.digits}, (i) => SizedBox(width: 40, child: TextField(textAlign: TextAlign.center, decoration: OutlineInputBorder() as InputDecoration))))`;

    case "searchbar":
      return `TextField(decoration: InputDecoration(hintText: '${esc(p.placeholder)}', prefixIcon: const Icon(Icons.search), filled: true, fillColor: ${hexToDart(p.bg)}, border: OutlineInputBorder(borderRadius: BorderRadius.circular(${p.radius}), borderSide: BorderSide.none)))`;

    case "tabbar":
      return `DefaultTabController(length: ${(p.tabs || []).length}, child: TabBar(labelColor: ${hexToDart(p.activeColor)}, tabs: [${(p.tabs || []).map((t: string) => `Tab(text: '${esc(t)}')`).join(", ")}]))`;

    case "progressbar":
      return `LinearProgressIndicator(value: ${p.value} / 100, color: ${hexToDart(p.color)}, backgroundColor: ${hexToDart(p.track)})`;

    case "circularprogress":
      return `CircularProgressIndicator(value: ${p.value} / 100, color: ${hexToDart(p.color)})`;

    case "ratingbar":
      return `Row(children: List.generate(${p.max}, (i) => Icon(i < ${p.value} ? Icons.star : Icons.star_border, color: ${hexToDart(p.color)})))`;

    case "badge":
      return `Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4), decoration: BoxDecoration(color: ${hexToDart(p.bg)}, borderRadius: BorderRadius.circular(999)), child: Text('${esc(p.text)}', style: TextStyle(color: ${hexToDart(p.color)}, fontSize: 11, fontWeight: FontWeight.bold)))`;

    case "chip":
      return `Chip(label: Text('${esc(p.text)}'), backgroundColor: ${hexToDart(p.bg)}, labelStyle: TextStyle(color: ${hexToDart(p.color)}))`;

    case "snackbar":
      return `Container(padding: const EdgeInsets.symmetric(horizontal: 14), color: ${hexToDart(p.bg)}, alignment: Alignment.centerLeft, child: Text('${esc(p.text)}', style: TextStyle(color: ${hexToDart(p.color)}))) /* trigger with ScaffoldMessenger.of(context).showSnackBar(...) */`;

    case "sizedbox":
      return `SizedBox(width: ${w.width}, height: ${w.height})`;

    case "opacity":
      return `Opacity(opacity: ${p.opacity}, child: Container(color: ${hexToDart(p.bg)}, child: ${genChildrenColumn(w.children || [], indent, pages)}))`;

    case "stack":
      return `Stack(children: [${(w.children || []).map((c) => genChild(c, indent + 1, pages)).join(", ")}])`;

    case "card":
      return `Card(\n${pad}  color: ${hexToDart(p.bg)},\n${pad}  elevation: ${p.elevation},\n${pad}  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(${p.radius})),\n${pad}  child: Padding(padding: EdgeInsets.all(${p.padding}), child: ${genChildrenColumn(w.children || [], indent, pages)}),\n${pad})`;

    case "listview":
      return `ListView(padding: EdgeInsets.all(${p.padding}), children: [${(w.children || []).map((c) => genChild(c, indent + 1, pages) + ",").join("\n" + pad)}])`;

    case "gridview":
      return `GridView.count(crossAxisCount: ${p.columns}, mainAxisSpacing: ${p.gap}, crossAxisSpacing: ${p.gap}, padding: EdgeInsets.all(${p.padding}), children: [${(w.children || []).map((c) => genChild(c, indent + 1, pages) + ",").join("\n" + pad)}])`;

    case "pageview":
      return `PageView(children: [${(w.children || []).map((c) => genChild(c, indent + 1, pages) + ",").join("\n" + pad)}])`;

    case "container": {
      const child = (w.children || []).length ? genChildrenColumn(w.children!, indent, pages) : "null";
      return `Container(\n${pad}  width: ${w.width}, height: ${w.height}, padding: EdgeInsets.all(${p.padding}),\n${pad}  decoration: BoxDecoration(color: ${hexToDart(p.bg)}, borderRadius: BorderRadius.circular(${p.radius})),\n${pad}  child: ${child},\n${pad})`;
    }

    case "row":
    case "column": {
      const flutterWidget = w.type === "row" ? "Row" : "Column";
      const kids = w.children || [];
      const spacer = w.type === "row" ? `SizedBox(width: ${p.gap})` : `SizedBox(height: ${p.gap})`;
      const parts = kids.map((c) => genChild(c, indent + 1, pages));
      const joined = parts.join(`,\n${pad}  ${spacer},\n${pad}  `);
      return `Container(\n${pad}  width: ${w.width}, height: ${w.height}, padding: EdgeInsets.all(${p.padding}),\n${pad}  child: ${flutterWidget}(mainAxisSize: MainAxisSize.min, children: [\n${pad}  ${joined}\n${pad}  ]),\n${pad})`;
    }

    default:
      return `Container()`;
  }
}

function genChildrenColumn(children: Widget[], indent: number, pages: Page[]): string {
  const pad = "  ".repeat(indent);
  if (children.length === 0) return "null";
  if (children.length === 1) return genChild(children[0], indent, pages);
  return `Column(mainAxisSize: MainAxisSize.min, children: [\n${pad}  ${children.map((c) => genChild(c, indent + 1, pages) + ",").join(`\n${pad}  `)}\n${pad}])`;
}

export function generateFlutterPage(page: Page, pages: Page[]): string {
  const className = dartClassName(page.name);
  const positioned = page.widgets
    .filter((w) => !w.hidden)
    .map((w) => `        Positioned(left: ${w.x}, top: ${w.y}, width: ${w.width}, height: ${w.height}, child: ${genChild(w, 4, pages).trim()}),`)
    .join("\n");

  const appBar = page.appBar.enabled
    ? `AppBar(title: const Text('${esc(page.appBar.title)}'), backgroundColor: ${hexToDart(page.appBar.bg)}, foregroundColor: ${hexToDart(page.appBar.color)}),`
    : "null,";

  const bottomNav = page.bottomNav.enabled
    ? `BottomNavigationBar(\n      backgroundColor: ${hexToDart(page.bottomNav.bg)},\n      selectedItemColor: ${hexToDart(page.bottomNav.activeColor)},\n      items: [${page.bottomNav.items.map((it) => `BottomNavigationBarItem(icon: const Icon(Icons.circle), label: '${esc(it.label)}')`).join(", ")}],\n    ),`
    : "null,";

  const drawer = page.drawer.enabled
    ? `Drawer(\n      child: ListView(children: [${page.drawer.items.map((it) => `ListTile(title: Text('${esc(it)}'), onTap: () {})`).join(", ")}]),\n    ),`
    : "null,";

  return `import 'package:flutter/material.dart';

class ${className} extends StatelessWidget {
  const ${className}({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: ${appBar}
      drawer: ${drawer}
      bottomNavigationBar: ${bottomNav}
      body: SafeArea(
        child: Stack(
          children: [
${positioned}
          ],
        ),
      ),
    );
  }
}
`;
}

export function generateMain(pages: Page[]): string {
  const routes = pages
    .map((p) => `        '${routeName(p.id, pages)}': (context) => const ${dartClassName(p.name)}(),`)
    .join("\n");
  const imports = pages.map((p) => `import 'pages/${slug(p.name)}.dart';`).join("\n");

  return `import 'package:flutter/material.dart';
${imports}

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Generated App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: const Color(0xFF6D5EFC)),
      initialRoute: '${routeName(pages[0].id, pages)}',
      routes: {
${routes}
      },
    );
  }
}
`;
}

export function slug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/(^_|_$)/g, "") || "page";
}

export function generatePubspec(): string {
  return `name: generated_app
description: Generated by App Builder
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6

flutter:
  uses-material-design: true
`;
}
