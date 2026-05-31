// Expo config plugin: disable fmt's consteval format-string checking.
//
// React Native 0.76 vendors fmt 11.0.2, whose `FMT_USE_CONSTEVAL 1` path fails
// to compile with the stricter `consteval` enforcement in newer Apple clang
// (Xcode 16.3+ / 26.x): "call to consteval function ... is not a constant
// expression" in fmt/format-inl.h. fmt's base.h defines FMT_USE_CONSTEVAL
// unconditionally (no #ifndef guard), so a -D preprocessor override is ignored.
// We patch the vendored header during `pod install` (post_install) so every
// fmt consumer (fmt, RCT-Folly, React-*) sees FMT_USE_CONSTEVAL=0. Idempotent
// and runs on both local prebuild and EAS Build.
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const MARKER = 'FinalBoss: disable fmt consteval';
const SNIPPET = `
    # --- ${MARKER} (Xcode/clang compatibility, RN 0.76 + fmt 11.0.2) ---
    fmt_base_h = File.join(installer.sandbox.root, 'fmt', 'include', 'fmt', 'base.h')
    if File.exist?(fmt_base_h)
      fmt_contents = File.read(fmt_base_h)
      fmt_patched = fmt_contents.gsub('#  define FMT_USE_CONSTEVAL 1', '#  define FMT_USE_CONSTEVAL 0')
      File.write(fmt_base_h, fmt_patched) if fmt_patched != fmt_contents
    end
    # --- end ${MARKER} ---
`;

module.exports = function withFmtConstevalFix(config) {
  return withDangerousMod(config, [
    'ios',
    async (cfg) => {
      const podfile = path.join(cfg.modRequest.platformProjectRoot, 'Podfile');
      let contents = fs.readFileSync(podfile, 'utf8');
      if (!contents.includes(MARKER)) {
        contents = contents.replace(
          /post_install do \|installer\|/,
          (match) => `${match}\n${SNIPPET}`
        );
        fs.writeFileSync(podfile, contents);
      }
      return cfg;
    },
  ]);
};
