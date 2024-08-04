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

/**
 * Checks if the given query is of type GetQueryFilterType.
 *
 * @param {GetQueryType} q - The query to check.
 * @return {q is GetQueryFilterType} - True if the query is of type GetQueryFilterType, false otherwise.
 */
const getIsQueryFilterType = (q: GetQueryType): q is GetQueryFilterType => {
  return q instanceof Object && 'condition' in q;
};

/**
 * Checks if the given schema is of type `SchemaObjectValueTypeType`.
 *
 * @param {SchemaObjectValueType | SchemaObjectValueTypeType} schema - The schema to check.
 * @return {schema is SchemaObjectValueTypeType} - Returns `true` if the schema is of type `SchemaObjectValueTypeType`, otherwise `false`.
 */
const getIsSchemaStringType = (
  schema: SchemaObjectValueType | SchemaObjectValueTypeType,
): schema is SchemaObjectValueTypeType => {
  return typeof schema === 'string';
};

/**
 * Parses the given order value and returns the corresponding parsed sort order.
 *
 * @param {GetQuerySortValuesType} order - The order value to parse.
 * @return {GetQuerySortParsedValuesType} The parsed sort order.
 */
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

/**
 * Parses an array of query objects and returns an array of QueryConstraint objects.
 *
 * @param {GetQueryType[]} query - An array of query objects.
 * @return {QueryConstraint[]} An array of QueryConstraint objects.
 */
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

/**
 * Validates the field value based on the schema type.
 *
 * @param {SchemaObjectValueTypeType} field - The type of the schema field.
 * @param {any} value - The value to validate.
 * @return {boolean} Whether the value is valid for the field type.
 */
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

/**
 * Validates the fields of a given data object against a schema object.
 *
 * @param {SchemaObjectType} schema - The schema object to validate against.
 * @param {any} data - The data object to validate.
 * @return {boolean} Returns true if all fields in the data object are valid according to the schema object, otherwise false.
 */
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
