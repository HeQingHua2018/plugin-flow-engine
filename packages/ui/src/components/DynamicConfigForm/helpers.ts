import RuleEditor from '../RuleEditor';
import type { FieldBase } from '../../types';

const RuleEditorUtil = (RuleEditor as any).Util;

export function isRuleEditorField(field: any): boolean {
  return field?.type === 'rule_editor' || field?.widget === 'rule_editor';
}

export function isEngineConditions(value: any): boolean {
  return (
    value &&
    typeof value === 'object' &&
    (Array.isArray(value.all) || Array.isArray(value.any))
  );
}

function getRuleEditorKey(): string {
  return Math.random().toString(36).substring(2, 12);
}

export function engineConditionsToRuleEditorValue(value: any, field?: FieldBase): any {
  if (!isEngineConditions(value)) return value;
  try {
    const fields = field?.widgetProps?.fields || [];
    return (RuleEditor as any).Util?.transformFromEngineConditions
      ? (RuleEditor as any).Util.transformFromEngineConditions(value, fields)
      : value;
  } catch (err) {
    return value;
  }
}

export function normalizeConfigFormValues(values: Record<string, any>, schema: any): Record<string, any> {
  if (!schema?.config?.length) return values;
  const normalized = { ...values };

  schema.config.forEach((field: FieldBase) => {
    if (!field) return;
    const rawField = `${field.field}Raw`;
    const rawValue = values[field.field] === undefined ? values[rawField] : values[field.field];

    if (rawValue === undefined) {
      delete normalized[rawField];
      return;
    }

    if (typeof field.toStorage === 'function') {
      normalized[field.field] = field.toStorage(rawValue, field);
    } else if (isRuleEditorField(field)) {
      try {
        normalized[field.field] = RuleEditorUtil.transformToEngineConditions(rawValue);
      } catch (error) {
        normalized[field.field] = rawValue;
      }
    } else {
      normalized[field.field] = rawValue;
    }

    delete normalized[rawField];
  });

  return normalized;
}

export function prepareConfigFormValues(values: Record<string, any>, schema: any): Record<string, any> {
  if (!schema?.config?.length) return values;
  const prepared = { ...values };

  schema.config.forEach((field: FieldBase) => {
    if (!field) return;
    const rawField = `${field.field}Raw`;

    if (values[rawField] !== undefined) {
      prepared[field.field] = values[rawField];
      delete prepared[rawField];
      return;
    }

    if (typeof field.fromStorage === 'function') {
      prepared[field.field] = field.fromStorage(values[field.field], field);
      return;
    }

    if (isRuleEditorField(field) && isEngineConditions(values[field.field])) {
      prepared[field.field] = engineConditionsToRuleEditorValue(values[field.field], field);
    }
  });

  return prepared;
}
