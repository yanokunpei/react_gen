import {NinComponentInitializer, NinElement, ROOT_ID} from "../../Entities/NinComponent";
import {Map} from "immutable";

export class ComponentFile {
  path: string;
  name: string;
  row: string | undefined;
  fullName(): string { return this.path + "." + this.name }
  elements: Map<string, NinElement>;
  constructor(fullName: string, elements: Map<string, NinElement> = Map()) {
    const path = fullName.split(".");
    this.name = path.pop()!;
    this.path = path.join(".");
    this.elements = elements;
  }

  getComponentInitializer(): NinComponentInitializer {
    return ({
      path: this.path,
      type: this.name,
      hasChild: false,
      hasCss: false,
      attributes: [],
    })
  }

  private copy(...differ: Array<object>): ComponentFile {
    return Object.assign(Object.create(ComponentFile.prototype), this, ...differ)
  }

  addNode(element: NinElement): ComponentFile {
    if(element.parent == ROOT_ID) return this.copy({ elements: this.elements.set(element.id, element) });
    return this.copy({ elements: this.elements.set(element.id, element).update(element.parent, it => it.addChild(element.id)) });
  }
  removeNode(id: string): ComponentFile {
    let ret = this.elements;
    ret = (ret.get(id).parent !== ROOT_ID)? ret.update(ret.get(id).parent, it => it.removeChild(id)) : ret;
    const remove = (id: string) => {
      const children = this.elements.get(id).children;
      children.forEach(it => {
        remove(it!);
      });
      ret = ret.delete(id);
    };
    remove(id);
    return this.copy({ elements: ret });
  }
  moveNode(moveNodeId: string, parentId: string, ref: string | null): ComponentFile {
    const moveNode = this.elements.get(moveNodeId);
    const oldParentId = moveNode.parent;
    if(moveNode.id === parentId) return this;
    let newElements = this.elements
      .update(moveNode.id, v => v.changeParent(parentId));
    if(parentId !== ROOT_ID) newElements = newElements.update(parentId, v => v.addChild(moveNode.id, ref));
    if(oldParentId !== ROOT_ID) newElements = newElements.update(oldParentId, v => v.removeChild(moveNode.id));
    return this.copy({elements: newElements});
  }
  addCssClassToNode(id: string, className: string): ComponentFile {
    return this.copy({ elements: this.elements.update(id, it => it.addCssClass(className)) });
  }
  removeCssClassFromNode(id: string, className: string): ComponentFile {
    return this.copy({ elements: this.elements.update(id, it => it.removeCssClass(className)) });
  }
  changeAttribute(id: string, attr: string, value: string): ComponentFile {
    return this.copy( { elements: this.elements.update(id, it => {
        return it.changeAttribute(attr, value)
      })});
  }
  copyNodes(id: string): Map<string, NinElement> {
    let ret = Map<string, NinElement>();
    const get = (id: string) => {
      this.elements.get(id).children.forEach(it => get(it!));
      ret = ret.set(id, this.elements.get(id));
    };
    get(id);
    return ret;
  }
}