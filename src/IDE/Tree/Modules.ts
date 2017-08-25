import {Action} from 'redux'
import {Map} from "immutable"
import {NinComponent, root} from "../../Entities/NinComponent";

export enum TreeItemPosition {
  before = "before",
  body = "body",
  after = "after",
}

enum ActionNames {
  CreateNode = "Tree.CreateNode",
  MoveNode = "Tree.MoveNode",
}

interface CreateNodeAction extends Action {
  type: ActionNames.CreateNode
  node: NinComponent
  parent: string
}
export const createNode = (node: NinComponent, parent: string): CreateNodeAction => ({
  type: ActionNames.CreateNode,
  node,
  parent
});

interface MoveNodeAction extends Action {
  type: ActionNames.MoveNode
  moveId: string
  targetId: string
  position: TreeItemPosition
}

export const moveNode = (moveId: string, targetId: string, position: TreeItemPosition): MoveNodeAction => ({
  type: ActionNames.MoveNode,
  moveId,
  targetId,
  position,
});


export interface TreeState {
  node: Map<string,NinComponent>
  selectedItemId: string
}

export type TreeAction = CreateNodeAction
    | MoveNodeAction

const initialState: TreeState= {
  node: Map({root: root()}),
  selectedItemId: "root"
};

export default function reducer(state: TreeState = initialState, action: TreeAction): TreeState {
  switch (action.type) {
    case ActionNames.CreateNode: {
      const node = state.node.set(action.parent, state.node.get(action.parent).addChild(action.node.id));
      return Object.assign({}, state, {node: node.set(action.node.id, action.node)});
    }
    case ActionNames.MoveNode: {
      const moveNode = state.node.get(action.moveId);
      const oldParentId = moveNode.parent;
      const newParentId = (action.position === TreeItemPosition.body)? action.targetId : state.node.get(action.targetId).parent;
      const target = (action.position === TreeItemPosition.body)? undefined : action.targetId;
      const isAfter = (action.position === TreeItemPosition.after)? true : undefined;
      if(moveNode.id === newParentId) return state;
      let newNodes = state.node
          .update(moveNode.id, v => v.changeParent(newParentId))
          .update(oldParentId, v => v.removeChild(moveNode.id))
          .update(newParentId, v => v.addChild(moveNode.id, target, isAfter));
      return Object.assign({}, state, { node: newNodes });
    }
    default: { return state }
  }
}