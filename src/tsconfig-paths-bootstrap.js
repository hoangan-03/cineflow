const tsConfigPaths = require("tsconfig-paths");
const { compilerOptions } = require("../tsconfig.json");

tsConfigPaths.register({
  baseUrl: "./dist",
  paths: Object.keys(compilerOptions.paths || {}).reduce(
    (paths, key) => ({
      ...paths,
      [key]: compilerOptions.paths[key].map((p) =>
        p.replace(/^src\//, "").replace(/\.ts$/, ".js")
      ),
    }),
    {}
  ),
});
