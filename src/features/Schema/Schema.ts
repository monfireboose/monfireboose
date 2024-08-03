import pluralize from 'pluralize';

import { FirestoreService } from '../FirestoreService/FirestoreService';

import { parseQuery } from './helpers';

import { SchemaObjectType, GetQueryType } from './types';

class Schema {
  public name?: string;

  constructor(
    public schema: SchemaObjectType,
    private firestore = new FirestoreService(),
  ) {
    this.schema = schema;
  }

  get(...getQuery: GetQueryType[]) {
    this.ctachError();

    const parsedQuery = parseQuery(getQuery);

    return this.firestore.get(this.name as string, ...parsedQuery);
  }

  getDoc(id: string) {
    this.ctachError();

    return this.firestore.getDoc(this.name as string, id);
  }

  add(data: any) {
    // TODO make typeof Something
    this.ctachError();

    return this.firestore.add(this.name as string, data);
  }

  edit(data: any, id: string) {
    // TODO make typeof Something
    this.ctachError();

    return this.firestore.edit(this.name as string, data, id);
  }

  delete(id: string) {
    this.ctachError();

    return this.firestore.delete(this.name as string, id);
  }

  ctachError() {
    if (!this.name) {
      throw new Error('Model name is required');
    }
  }
}

const model = (modelName: string, schema: Schema) => {
  if (!modelName) {
    throw new Error('Model name is required');
  }

  if (!schema) {
    throw new Error('Schema is required');
  }

  schema.name = pluralize.plural(modelName);

  if (!schema.name) {
    throw new Error('Model name is required');
  }

  return schema;
};

export { Schema, model };
