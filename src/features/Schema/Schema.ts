import pluralize from 'pluralize';

import { FirestoreService } from '../FirestoreService/FirestoreService';

import { parseQuery, validateFields } from './helpers';

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
    this.checkSchemaName();

    const parsedQuery = parseQuery(getQuery);

    return this.firestore.get(this.name as string, ...parsedQuery);
  }

  getDoc(id: string) {
    this.checkSchemaName();

    return this.firestore.getDoc(this.name as string, id);
  }

  add(data: any) {
    // TODO make typeof Something
    this.checkSchemaName();
    this.checkIsValid(data);

    return this.firestore.add(this.name as string, data);
  }

  edit(data: any, id: string) {
    // TODO make typeof Something
    this.checkSchemaName();
    this.checkIsValid(data);

    return this.firestore.edit(this.name as string, data, id);
  }

  delete(id: string) {
    this.checkSchemaName();

    return this.firestore.delete(this.name as string, id);
  }

  private checkSchemaName() {
    if (!this.name) {
      throw new Error('Model name is required');
    }
  }

  private checkIsValid(data: any) {
    const isValid = validateFields(this.schema, data);

    if (!isValid) {
      // TODO throw more sepcified error messages
      throw new Error('Provided object does not match the Schema.');
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
