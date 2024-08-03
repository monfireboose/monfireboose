import { where, orderBy, QueryConstraint } from 'firebase/firestore';

import {
  GetQueryType,
  GetQueryFilterType,
  GetQuerySortParsedValuesType,
} from './types';

import { QueryConditionEnum } from './enums';

const getQueryType = (q: GetQueryType): q is GetQueryFilterType => {
  return q instanceof Object && 'condition' in q;
};

const parseQuery = (query: GetQueryType[]): QueryConstraint[] => {
  return query.map((q) => {
    if (getQueryType(q)) {
      const [field, filter] = Object.entries(q)[0]!;

      return where(field, QueryConditionEnum[filter.condition], filter);
    } else {
      const [field, order] = Object.entries(q)[0]!;

      let parsedOrder: GetQuerySortParsedValuesType;

      if (order === 1) {
        parsedOrder = 'asc';
      } else if (order === -1) {
        parsedOrder = 'desc';
      } else {
        parsedOrder = order;
      }

      return orderBy(field, parsedOrder);
    }
  });
};

export { parseQuery };
