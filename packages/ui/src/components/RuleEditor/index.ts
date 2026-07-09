import { default as RuleEditorComponent } from "./RuleEditor";
import RuleUtil from './rule_utils';
const RuleEditor = Object.assign(RuleEditorComponent, { Util: RuleUtil });

export default RuleEditor;
export type { RuleEditorProps, RuleFieldData, RuleItemDataProp } from "./types";
