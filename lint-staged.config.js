const ignorePatterns = [
  /(?:^|\/)jsr\.json$/,
  /(?:^|\/)CHANGELOG\.md$/,
  /(?:^|\/)pnpm-lock\.yaml$/,
  // apps/* uses Nuxt tooling; vp fmt un-escapes <\/script> in code samples.
  /(?:^|\/)apps\//,
];

const isIgnored = (file) => ignorePatterns.some((pattern) => pattern.test(file));

// The lint/format config lives in packages/v-mapkit/vite.config.ts. Run vp
// from that package so its files get the package config (single quotes etc.)
// that `format:check` enforces, not vp's root defaults.
const isLibraryFile = (file) => /(?:^|\/)packages\/v-mapkit\//.test(file);

const vp = (args, files) => {
  const library = files.filter(isLibraryFile);
  const other = files.filter((f) => !isLibraryFile(f));
  const commands = [];
  if (library.length > 0)
    commands.push(`pnpm --filter @geoql/v-mapkit exec vp ${args} ${library.join(" ")}`);
  if (other.length > 0) commands.push(`vp ${args} ${other.join(" ")}`);
  return commands;
};

export default {
  "*.{js,jsx,ts,tsx,vue}": (files) => {
    const filtered = files.filter((f) => !isIgnored(f));
    return [...vp("lint --fix", filtered), ...vp("fmt --write", filtered)];
  },
  "*.{json,md,yml,yaml,css,html}": (files) => {
    const filtered = files.filter((f) => !isIgnored(f));
    return vp("fmt --write", filtered);
  },
};
