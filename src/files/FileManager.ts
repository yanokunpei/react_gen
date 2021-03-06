import * as fs from "fs-extra";
import * as Path from "path";
import { CssClassManager } from "../react/Css/CssClassManager";
import { ROOT_ID } from "../react/Entities/NinElement";
import { Project } from "../react/IDE/Project/Project";
import { Toml, Util } from "../Util";
import { createComponentFile, SavedFile } from "./SaveProject";

export interface SavedIndex {
  group: string;
  project: string;
  version: string;
  root: string;
  css: string;
  dependency: string[];
}

export const ENCODING = "utf8";
export interface SavedCss {
  [className: string]: { [attr: string]: string };
}

class FileManager {
  ROOT_DIR: string;
  PROJECT_DIR: string;
  setRootDir(dir: string) {
    this.ROOT_DIR = dir;
    this.PROJECT_DIR = Path.join(this.ROOT_DIR, "projects");
  }
  makeProjectDir(prjName: string) {
    fs.mkdirsSync(Path.join(this.PROJECT_DIR, prjName));
  }
  getProjectNames(): string[] {
    try {
      return fs.readdirSync(this.PROJECT_DIR).filter(it => it !== ".DS_Store");
    } catch (e) {
      return [];
    }
  }
  saveProject(project: Project, cssManage: CssClassManager) {
    this.makeProjectDir(project.projectName);
    fs.removeSync(Path.join(this.PROJECT_DIR, project.projectName, "src"));
    const createIndexToml = (prj: Project): string => {
      return Toml.stringify({
        group: prj.groupName,
        project: prj.projectName,
        version: prj.version,
        root: prj.root,
        css: "./style", // todo
        dependency: [] // todo
      });
    };
    this.writeFile(
      Path.join(this.PROJECT_DIR, project.projectName, "src"),
      "index.toml",
      createIndexToml(project)
    );
    this.writeFile(
      Path.join(this.PROJECT_DIR, project.projectName, "src"),
      "css.toml",
      Toml.stringify(cssManage.getSavable())
    );
    project.files.toArray().forEach(it => {
      const paths = it.path.split(".");
      const fileName = it.name;
      this.writeFile(
        Path.join(this.PROJECT_DIR, project.projectName, "src", ...paths),
        fileName! + ".toml",
        createComponentFile(it)
      );
    });
  }
  createNewProject(projectName: string, group: string) {
    const index: SavedIndex = {
      group,
      project: projectName,
      version: "0.0.1",
      root: "App",
      css: "",
      dependency: []
    };
    const app: SavedFile = {
      path: "",
      name: "App",
      props: {},
      state: {},
      store: {},
      initialStore: {},
      actions: {},
      reducer: {},
      node: [
        {
          type: "HTML.div",
          id: Util.generateId(),
          parent: ROOT_ID,
          children: [],
          className: [],
          attribute: []
        }
      ]
    };
    const prj = new Project(index, [app], {});
    this.saveProject(prj, new CssClassManager());
  }
  loadProject(
    projectName: string
  ): { files: SavedFile[]; index: SavedIndex; css: SavedCss } {
    const index: SavedIndex = Toml.parse(
      fs.readFileSync(
        Path.join(this.PROJECT_DIR, projectName, "src", "index.toml"),
        ENCODING
      )
    );
    const css: { [className: string]: { [attr: string]: string } } = Toml.parse(
      fs.readFileSync(
        Path.join(this.PROJECT_DIR, projectName, "src", "css.toml"),
        ENCODING
      )
    );
    const files = this.readSubDirSync(
      Path.join(this.PROJECT_DIR, projectName, "src")
    )
      .filter(it => !it.includes("index.toml"))
      .filter(it => !it.includes("css.toml"))
      .filter(it => !it.includes(".DS_Store"))
      .map(it => {
        const file: SavedFile = Toml.parse(fs.readFileSync(it, ENCODING));
        file.path = Path.relative(
          Path.join(this.PROJECT_DIR, projectName, "src"),
          it
        )
          .split(Path.sep)
          .slice(0, -1)
          .join(".");
        return file;
      });
    return {
      files,
      index,
      css
    };
  }
  readSubDirSync(folderPath: string) {
    const result: string[] = [];
    const readTopDirSync = (folderPath: string) => {
      let items = fs.readdirSync(folderPath);
      items = items.map(itemName => {
        return Path.join(folderPath, itemName);
      });
      items.forEach(itemPath => {
        if (fs.statSync(itemPath).isDirectory()) readTopDirSync(itemPath);
        else result.push(itemPath);
      });
    };
    readTopDirSync(folderPath);
    return result;
  }
  private writeFile(path: string, fileName: string, data: string) {
    if (!fs.existsSync(path)) fs.mkdirsSync(path);
    fs.writeFileSync(Path.join(path, fileName), data);
  }
}
export const fileManager = new FileManager();
