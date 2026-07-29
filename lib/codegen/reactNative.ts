import { Page, Widget } from "../types";

function esc(s: any) {
  return String(s ?? "").replace(/'/g, "\\'");
}

function genChild(w: Widget, indent: number): string {
  const pad = "  ".repeat(indent);
  const p = w.props || {};

  switch (w.type) {
    case "text":
      return `<Text style={{ fontSize: ${p.fontSize}, fontWeight: '${p.fontWeight}', color: '${p.color}' }}>${esc(p.text)}</Text>`;
    case "textfield":
      return `<TextInput placeholder='${esc(p.placeholder)}' style={{ backgroundColor: '${p.bg}', borderColor: '${p.border}', borderWidth: 1, borderRadius: ${p.radius}, padding: 10 }} />`;
    case "textbutton":
      return `<TouchableOpacity onPress={() => ${w.navigateTo ? `navigation.navigate('${w.navigateTo}')` : "{}"}} style={{ backgroundColor: '${p.bg}', borderRadius: ${p.radius}, padding: 12, alignItems: 'center' }}>\n${pad}  <Text style={{ color: '${p.color}', fontWeight: '600' }}>${esc(p.text)}</Text>\n${pad}</TouchableOpacity>`;
    case "image":
      return `<Image source={{ uri: 'https://picsum.photos/seed/${p.seed}/${Math.round(w.width)}/${Math.round(w.height)}' }} style={{ width: ${w.width}, height: ${w.height}, borderRadius: ${p.radius} }} />`;
    case "circleimage":
      return `<Image source={{ uri: 'https://picsum.photos/seed/${p.seed}/100/100' }} style={{ width: ${w.width}, height: ${w.height}, borderRadius: ${w.width / 2} }} />`;
    case "switch":
      return `<Switch value={${!!p.on}} trackColor={{ true: '${p.color}' }} />`;
    case "divider":
      return `<View style={{ height: ${p.thickness}, backgroundColor: '${p.color}', width: '100%' }} />`;
    case "container": {
      const kids = (w.children || []).map((c) => genChild(c, indent + 1)).join(`\n${pad}  `);
      return `<View style={{ width: ${w.width}, height: ${w.height}, backgroundColor: '${p.bg}', borderRadius: ${p.radius}, padding: ${p.padding} }}>\n${pad}  ${kids}\n${pad}</View>`;
    }
    case "row":
    case "column": {
      const kids = (w.children || []).map((c) => genChild(c, indent + 1)).join(`\n${pad}  `);
      return `<View style={{ width: ${w.width}, height: ${w.height}, flexDirection: '${w.type === "row" ? "row" : "column"}', gap: ${p.gap}, padding: ${p.padding} }}>\n${pad}  ${kids}\n${pad}</View>`;
    }
    default:
      return `<View style={{ width: ${w.width}, height: ${w.height} }} />`;
  }
}

export function generateReactNativePage(page: Page): string {
  const body = page.widgets
    .filter((w) => !w.hidden)
    .map((w) => `      <View style={{ position: 'absolute', left: ${w.x}, top: ${w.y} }}>\n        ${genChild(w, 4)}\n      </View>`)
    .join("\n");

  return `import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Switch, SafeAreaView, StyleSheet } from 'react-native';

export default function ${page.name.replace(/[^a-zA-Z0-9]/g, "")}Screen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
${body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
});
`;
}
