/**
 * Represents the type of a value in a schema object.
 *
 * @typedef {'string' | 'number' | 'boolean' | 'date'} SchemaObjectValueTypeType
 */
export type SchemaObjectValueTypeType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date';

/**
 * Represents a value in a schema object.
 *
 * @typedef {Object} SchemaObjectValueType
 * @property {SchemaObjectValueTypeType} type - The type of the value.
 * @property {boolean} [required] - Whether the value is required.
 * @property {any} [default] - The default value of the value.
 * @property {string} [ref] - The reference to another schema object.
 * @property {boolean} [nullable] - Whether the value can be null.
 */
export type SchemaObjectValueType = {
  type: SchemaObjectValueTypeType; // TODO add support for arrays of this values
  required?: boolean;
  default?: any;
  ref?: string;
  nullable?: boolean;
};

/**
 * Represents a schema object.
 *
 * @typedef {Object.<string, SchemaObjectValueType | SchemaObjectValueTypeType>} SchemaObjectType
 */
export type SchemaObjectType = Record<
  string,
  SchemaObjectValueType | SchemaObjectValueTypeType
>;

/**
 * Represents a filter value in a query.
 *
 * @typedef {Object} GetQueryFilterValueType
 * @property {'equals' | 'notEquals' | 'in' | 'notIn' | 'gt' | 'lt' | 'gte' | 'lte' | 'arrayContains' | 'arrayContainsAny'} condition - The condition to apply to the filter.
 * @property {any} value - The value to filter by.
 */
export type GetQueryFilterValueType = {
  condition:
    | 'equals'
    | 'notEquals'
    | 'in'
    | 'notIn'
    | 'gt'
    | 'lt'
    | 'gte'
    | 'lte'
    | 'arrayContains'
    | 'arrayContainsAny';
  value: any;
};

/**
 * Represents a filter in a query.
 *
 * @typedef {Object.<string, GetQueryFilterValueType>} GetQueryFilterType
 */
export type GetQueryFilterType = Record<string, GetQueryFilterValueType>;

/**
 * Represents the sort order of a query.
 *
 * @typedef {'asc' | 'desc' | 1 | -1} GetQuerySortValuesType
 */
export type GetQuerySortValuesType = 'asc' | 'desc' | 1 | -1;

/**
 * Represents the parsed sort order of a query.
 *
 * @typedef {'asc' | 'desc'} GetQuerySortParsedValuesType
 */
export type GetQuerySortParsedValuesType = 'asc' | 'desc';

/**
 * Represents a sort in a query.
 *
 * @typedef {Object.<string, GetQuerySortValuesType>} GetQuerySortType
 */
type GetQuerySortType = Record<string, GetQuerySortValuesType>;

/**
 * Represents a query.
 *
 * @typedef {GetQueryFilterType | GetQuerySortType} GetQueryType
 */
export type GetQueryType = GetQueryFilterType | GetQuerySortType;
