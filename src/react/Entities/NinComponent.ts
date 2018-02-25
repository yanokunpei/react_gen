import {List} from "immutable";
import {SavedAttribute, SavedNode} from "../../files/SaveProject";
import {Util} from "../../Util";
import {AttributeInfo, NinElementAttribute} from "../Html/Attribute";


export class NinElement {
  readonly path: string;
  readonly type: string;
  fullName = () => `${this.path}.${this.type}`;
  readonly hasChild: boolean;
  readonly parent: string;
  readonly children: List<string> = List();
  readonly id: string;
  readonly classList: List<string>;
  readonly attributes: List<NinElementAttribute>;

  static fromSavedNode(initializer: NinComponentInitializer, node: SavedNode): NinElement {
    return new NinElement(initializer, node.parent, node.children, node.className, node.attribute, node.id);
  }
  constructor(initializer: NinComponentInitializer,
              parent: string,
              children: Array<string> = [],
              classList: Array<string> = [],
              attrs: Array<SavedAttribute> = [],
              id: string = Util.generateId()) {
    this.path = initializer.path;
    this.type = initializer.type;
    this.hasChild = initializer.hasChild;
    this.parent = parent;
    this.children = List(children);
    this.id = id;
    this.classList = List(classList);
    let tempAttr = List(initializer.attributes.map(it => ({
      name: it.name,
      type: it.type,
      isRequired: it.isRequired,
      value: ""
    })));
    attrs.forEach(attr => {
      const index = tempAttr.findIndex(it => it!.name === attr.name);
      tempAttr = tempAttr.update(index, it => Object.assign({}, it, {value: attr.value}))
    });
    this.attributes = tempAttr;
  }
  copy(...obj: Array<object>): NinElement { return Object.assign(Object.create(NinElement.prototype), this, ...obj) }
  addChild(childId: string, ref: string | null = null): NinElement {
    return this.copy({ children: (!ref)? this.children.push(childId) : this.children.insert(this.children.indexOf(ref), childId) });
  }
  removeChild(id: string): NinElement { return this.copy({ children: this.children.filter( value => value !== id) }) }
  changeParent(id: string): NinElement { return this.copy({ parent: id }) }
  addCssClass(className: string): NinElement { return this.copy({ classList: this.classList.push(className) }) }
  removeCssClass(className:string): NinElement { return this.copy( { classList: this.classList.filter(it => it !== className)}) }
  changeAttribute(attr: string, value: string): NinElement { return this.copy({ attributes: this.updateAttr(attr, value)}) }
  private updateAttr(attr: string, value: string) {
    const index = this.attributes.findIndex(it => it!.name === attr);
    return this.attributes.update(index, it => Object.assign({}, it, {value}));
  }
}

export const ROOT_ID = "root";

export interface NinComponentInitializer {
  path: string
  type: string
  hasChild: boolean
  attributes: Array<AttributeInfo>
  hasCss: boolean
}

export const NinComponentString = {
  Children: "<$*children*$>",
  Text: "<$*text*$>",
  Attributes: "<$*attributes*$>",
};
