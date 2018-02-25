import {applyMiddleware ,createStore, combineReducers, Action} from 'redux'
import edit, {EditAction, EditState} from "./IDE/Edit/Modules";
import tree, {TreeAction, TreeState} from "./IDE/Tree/Modules";
import ide, {IDEAction, IDEState} from "./IDE/Modules";
import log, {LogAction, LogState} from "./IDE/Log/Modules";
import project, {ProjectAction} from "./IDE/Project/Modules";
import modal, {ModalAction, ModalState} from "./Modal/Modules";
import {loggerMiddleware} from "./middleware";
import {Project} from "./IDE/Project/Project";


export default createStore(
    combineReducers({
      ide,
      edit,
      tree,
      log,
      project,
      modal,
    }),
    applyMiddleware(loggerMiddleware)
)

export type AppState = {
  ide: IDEState
  edit: EditState
  tree: TreeState
  log: LogState
  project: Project
  modal: ModalState
}

export type AppAction = Action
    | IDEAction
    | EditAction
    | TreeAction
    | LogAction
    | ProjectAction
    | ModalAction