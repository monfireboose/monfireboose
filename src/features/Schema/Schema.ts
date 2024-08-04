import pluralize from 'pluralize';

import { FirestoreService } from '../FirestoreService/FirestoreService';

import { parseQuery, validateFields } from './helpers';

import { SchemaObjectType, GetQueryType } from './types';

/**
 * Represents a schema for working with Firestore data.
 *
 * @param {SchemaObjectType} schema - The schema object type for the Firestore data.
 * @param {FirestoreService} [firestore=new FirestoreService()] - The Firestore service used for database operations.
 */
class Schema {
  public name?: string;

  constructor(
    public schema: SchemaObjectType,
    private firestore = new FirestoreService(),
  ) {
    this.schema = schema;
  }

  /**
   * Retrieves data based on the provided query.
   *
   * @param {GetQueryType[]} getQuery - The query parameters to retrieve data.
   * @return {any} The data retrieved based on the query.
   */
  get(...getQuery: GetQueryType[]) {
    this.checkSchemaName();

    const parsedQuery = parseQuery(getQuery);

    return this.firestore.get(this.name as string, ...parsedQuery);
  }

  /**
   * Retrieves a document with the given ID.
   *
   * @param {string} id - The ID of the document to retrieve.
   * @return {type} description of return value
   */
  getDoc(id: string) {
    this.checkSchemaName();

    return this.firestore.getDoc(this.name as string, id);
  }

  /**
   * Adds data to the Firestore.
   *
   * @param {any} data - The data to be added to the Firestore.
   * @return {any} The result of adding the data to the Firestore.
   */
  add(data: any) {
    // TODO make typeof Something
    this.checkSchemaName();
    this.checkIsValid(data);

    return this.firestore.add(this.name as string, data);
  }

  /**
   * Edits a document in Firestore with the provided data and ID.
   *
   * @param {any} data - The data to edit the document with.
   * @param {string} id - The ID of the document to be edited.
   * @return {any} The result of editing the document in Firestore.
   */
  edit(data: any, id: string) {
    // TODO make typeof Something
    this.checkSchemaName();
    this.checkIsValid(data);

    return this.firestore.edit(this.name as string, data, id);
  }

  /**
   * Deletes a document in Firestore based on the provided ID.
   *
   * @param {string} id - The ID of the document to be deleted.
   * @return {any} The result of deleting the document in Firestore.
   */
  delete(id: string) {
    this.checkSchemaName();

    return this.firestore.delete(this.name as string, id);
  }

  /**
   * Checks if the model name is defined, throws an error if not.
   */
  private checkSchemaName() {
    if (!this.name) {
      throw new Error('Model name is required');
    }
  }

  /**
   * Validates the provided data against the schema and throws an error if the data does not match.
   *
   * @param {any} data - The data to validate against the schema.
   */
  private checkIsValid(data: any) {
    const isValid = validateFields(this.schema, data);

    if (!isValid) {
      // TODO throw more sepcified error messages
      throw new Error('Provided object does not match the Schema.');
    }
  }
}

/**
 * Creates a model with the provided model name and schema.
 *
 * @param {string} modelName - The name of the model to create.
 * @param {Schema} schema - The schema definition for the model.
 * @return {Schema} The created model schema.
 */
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
