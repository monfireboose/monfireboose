import pluralize from 'pluralize';

import { FirestoreService } from '../FirestoreService/FirestoreService';

type SchemaObjectValueTypeType =
  | string
  | number
  | boolean
  | (string | number | boolean)[];

type SchemaObjectValueType = {
  type: SchemaObjectValueTypeType;
  required?: boolean;
  default?: any;
  ref?: string;
};

type SchemaObjectType = Record<
  string,
  SchemaObjectValueType | SchemaObjectValueTypeType
>;

class Schema {
  public name?: string;

  constructor(
    public schema: SchemaObjectType,
    private firestore = new FirestoreService(),
  ) {
    this.schema = schema;
  }

  get() {
    return this.firestore.get;
  }

  getDoc() {
    return this.firestore.getDoc;
  }

  add() {
    return this.firestore.add;
  }

  edit() {
    return this.firestore.edit;
  }

  delete() {
    return this.firestore.delete;
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

  return schema.schema;
};

export { Schema, model };
