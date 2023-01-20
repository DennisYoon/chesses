import gulp from "gulp";
import ts from "gulp-typescript";
import del from "del";
import concat from "gulp-concat";
import stripImportExport from "gulp-strip-import-export";
import uglify from "gulp-uglify";

const tsProject = ts.createProject("tsconfig.json");

const routes = {
  typescript: {
    src: ["typescript/modules/*.ts", "typescript/main.ts"],
    dest: "src/pages/main",
    watch: ["typescript/modules/*.ts", "typescript/main.ts"]
  }
};

const Typescript = () =>
  gulp
    .src(routes.typescript.src)
    .pipe(tsProject())
    .pipe(stripImportExport())
    .pipe(uglify())
    .pipe(concat("index.js"))
    .pipe(gulp.dest(routes.typescript.dest));

const Clean = () => del("src/pages/main/index.js");

const Watch = () => {
  gulp.watch(routes.typescript.watch, Typescript);
};

const prepare = gulp.series([Clean]);
const assets = gulp.series([Typescript]);
const postDev = gulp.series([Watch]);

export const dev = gulp.series([prepare, assets, postDev]);