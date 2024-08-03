import { GetQueryFilterValueType } from './types';

// export type GetQueryFilterValueType = {
//   condition:
//     | 'equals'
//     | 'notEquals'
//     | 'in'
//     | 'not-in'
//     | 'gt'
//     | 'lt'
//     | 'gte'
//     | 'lte';
//   value: any;
// };

export enum QueryConditionEnum {
  equals = '==',
  notEquals = '!=',
  gt = '>',
  lt = '<',
  gte = '>=',
  lte = '<=',
  in = 'in',
  notIn = 'not-in',
  arrayContains = 'array-contains',
  arrayContainsAny = 'array-contains-any',
}
