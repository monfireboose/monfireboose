type SchemaObjectValueTypeType = string | string[];

type SchemaObjectValueType = {
  type: string;
  required?: boolean;
  default?: any;
  ref?: string;
  nullable?: boolean;
};

export type SchemaObjectType = Record<
  string,
  SchemaObjectValueType | SchemaObjectValueTypeType
>;

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

export type GetQueryFilterType = Record<string, GetQueryFilterValueType>;

type GetQuerySortValuesType = 'asc' | 'desc' | 1 | -1;

export type GetQuerySortParsedValuesType = 'asc' | 'desc';

type GetQuerySortType = Record<string, GetQuerySortValuesType>;

export type GetQueryType = GetQueryFilterType | GetQuerySortType;
