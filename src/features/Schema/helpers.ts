import { where, orderBy, QueryConstraint } from 'firebase/firestore';

import {
  GetQueryType,
  GetQueryFilterType,
  GetQuerySortParsedValuesType,
  GetQuerySortValuesType,
  SchemaObjectValueTypeType,
  SchemaObjectType,
  SchemaObjectValueType,
} from './types';

import { QueryConditionEnum } from './enums';

const getIsQueryFilterType = (q: GetQueryType): q is GetQueryFilterType => {
  return q instanceof Object && 'condition' in q;
};

const getIsSchemaStringType = (
  schema: SchemaObjectValueType | SchemaObjectValueTypeType,
): schema is SchemaObjectValueTypeType => {
  return typeof schema === 'string';
};

const getParsedOrder = (
  order: GetQuerySortValuesType,
): GetQuerySortParsedValuesType => {
  if (order === 1) {
    return 'asc';
  }

  if (order === -1) {
    return 'desc';
  }

  return order;
};

const parseQuery = (query: GetQueryType[]): QueryConstraint[] => {
  return query.map((q) => {
    if (getIsQueryFilterType(q)) {
      const [field, filter] = Object.entries(q)[0]!;

      return where(field, QueryConditionEnum[filter.condition], filter);
    }

    const [field, order] = Object.entries(q)[0]!;

    const parsedOrder = getParsedOrder(order);

    return orderBy(field, parsedOrder);
  });
};

const validateField = (field: SchemaObjectValueTypeType, value: any) => {
  switch (field) {
    case 'date':
      return value instanceof Date;
    case 'string':
    case 'number':
    case 'boolean':
      return typeof value === field;
    default:
      return false;
  }
};

const validateFields = (schema: SchemaObjectType, data: any) => {
  return Object.entries(data).every(([key, value]: [string, any]) => {
    if (!schema[key]) {
      return false;
    }

    if (getIsSchemaStringType(schema[key])) {
      return validateField(schema[key], value);
    }

    // if (Array.isArray(schema[key].type)) {
    //   return schema[key].type.every((type: SchemaObjectValueTypeType) => {
    //     return validateField(type, value);
    //   });
    // }

    return validateField(schema[key].type, value);
  });
};

export { parseQuery, validateFields };
