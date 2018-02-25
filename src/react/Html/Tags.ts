import {AttributeTypes} from "./Attribute";
import {NinComponentInitializer, NinComponentString} from "../Entities/NinComponent";

const list: Array<{name: string, hasChild: boolean, attributes?: Array<{name: string, isRequired: boolean, type: AttributeTypes}>}> = [
  {name: "section", hasChild: true,},
  {name: "nav",hasChild: true},
  {name: "article", hasChild: true},
  {name: "aside", hasChild: true},
  {name: "h1", hasChild: true},
  {name: "h2", hasChild: true},
  {name: "h3", hasChild: true},
  {name: "h4", hasChild: true},
  {name: "h5", hasChild: true},
  {name: "h6", hasChild: true},
  {name: "header", hasChild: true},
  {name: "footer", hasChild: true},
  {name: "address", hasChild: true},
  {name: "p", hasChild: true},
  {name: "hr", hasChild: true},
  {name: "pre", hasChild: true},
  {name: "blockquote", hasChild: true},
  {name: "ol", hasChild: true},
  {name: "ul", hasChild: true},
  {name: "li", hasChild: true},
  {name: "dl", hasChild: true},
  {name: "dt", hasChild: true},
  {name: "dd", hasChild: true},
  {name: "figure", hasChild: true},
  {name: "figcaption", hasChild: true},
  {name: "div", hasChild: true},
  {name: "main", hasChild: true},
  {name: "a", hasChild: true},
  {name: "em", hasChild: true},
  {name: "strong", hasChild: true},
  {name: "small", hasChild: true},
  {name: "s", hasChild: true},
  {name: "cite", hasChild: true},
  {name: "q", hasChild: true},
  {name: "dfn", hasChild: true},
  {name: "abbr", hasChild: true},
  {name: "time", hasChild: true},
  {name: "code", hasChild: true},
  {name: "var", hasChild: true},
  {name: "samp", hasChild: true},
  {name: "kbd", hasChild: true},
  {name: "sub", hasChild: true},
  {name: "sup", hasChild: true},
  {name: "i", hasChild: true},
  {name: "b", hasChild: true},
  {name: "mark", hasChild: true},
  {name: "ruby", hasChild: true},
  {name: "rt", hasChild: true},
  {name: "rp", hasChild: true},
  {name: "bdo", hasChild: true},
  {name: "span", hasChild: true},
  {name: "br", hasChild: false},
  {name: "wbr", hasChild: false},
  {name: "ins", hasChild: true},
  {name: "del", hasChild: true},
  {name: "img", hasChild: false},
  {name: "iframe", hasChild: true},
  {name: "embed", hasChild: false},
  {name: "object", hasChild: true},
  {name: "param", hasChild: false},
  {name: "video", hasChild: true},
  {name: "audio", hasChild: true},
  {name: "source", hasChild: false},
  {name: "canvas", hasChild: true},
  {name: "map", hasChild: true},
  {name: "area", hasChild: false},
  {name: "table", hasChild: true},
  {name: "caption", hasChild: true},
  {name: "colgroup", hasChild: true},
  {name: "col", hasChild: false},
  {name: "tbody", hasChild: true},
  {name: "thead", hasChild: true},
  {name: "tfoot", hasChild: true},
  {name: "tr", hasChild: true},
  {name: "td", hasChild: true},
  {name: "th", hasChild: true},
  {name: "form", hasChild: true},
  {name: "fieldset", hasChild: true},
  {name: "legend", hasChild: true},
  {name: "label", hasChild: true},
  {name: "input", hasChild: false, attributes: [{name: "type", isRequired: true, type: AttributeTypes.HTMLInput}]},
  {name: "button", hasChild: true},
  {name: "select", hasChild: true},
  {name: "datalist", hasChild: true},
  {name: "optgroup", hasChild: true},
  {name: "option", hasChild: false},
  {name: "textarea", hasChild: true},
  {name: "keygen", hasChild: false},
  {name: "output", hasChild: true},
  {name: "progress", hasChild: true},
  {name: "meter", hasChild: false},
  {name: "details", hasChild: true},
  {name: "summary", hasChild: true},
  {name: "menu", hasChild: true}
];

export const HTML_PATH = "HTML";

const getHTMLTagData = (): Array<NinComponentInitializer> => {
  return list.map(it => ({
    path: HTML_PATH,
    type: it.name,
    hasChild: it.hasChild,
    attributes: it.attributes || [],
    hasCss: true,
    row: `<${it.name}${NinComponentString.Attributes}>${(it.hasChild)? NinComponentString.Children : ""}</${it.name}>`
  })).concat({
    path: HTML_PATH,
    type: "textNode",
    hasChild: false,
    hasCss: false,
    row: NinComponentString.Text,
    attributes: [{name: 'text', isRequired: false, type: AttributeTypes.HTMLString}],
  });
};

export const HTML_TAGS = getHTMLTagData();




