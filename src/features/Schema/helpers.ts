import { where, orderBy, QueryConstraint } from 'firebase/firestore';

import {
  GetQueryType,
  GetQueryFilterType,
  GetQuerySortParsedValuesType,
  GetQuerySortValuesType,
} from './types';

import { QueryConditionEnum } from './enums';

const getQueryType = (q: GetQueryType): q is GetQueryFilterType => {
  return q instanceof Object && 'condition' in q;
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
    if (getQueryType(q)) {
      const [field, filter] = Object.entries(q)[0]!;

      return where(field, QueryConditionEnum[filter.condition], filter);
    }

    const [field, order] = Object.entries(q)[0]!;

    const parsedOrder = getParsedOrder(order);

    return orderBy(field, parsedOrder);
  });
};

export { parseQuery };
