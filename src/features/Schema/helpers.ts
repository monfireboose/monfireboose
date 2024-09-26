import { where, orderBy, QueryConstraint } from 'firebase/firestore';

import { FirestoreService } from '../FirestoreService/FirestoreService';

import {
  GetQueryType,
  GetQueryFilterType,
  GetQuerySortParsedValuesType,
  GetQuerySortValuesType,
  SchemaObjectValueTypeType,
  SchemaObjectType,
  SchemaObjectValueType,
  ValidationDataType,
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
const validateField = (
  Type: SchemaObjectValueTypeType,
  value: any,
  field: string,
  options?: {
    required?: boolean;
    nullable?: boolean;
  },
): ValidationDataType => {
  if (options !== undefined) {
    if (options.required === true && value === undefined) {
      return { isValid: false, reason: `${field} is required.` };
    }

    if (options.nullable !== true && value === null) {
      return { isValid: false, reason: `${field} cannot be null.` };
    }
  }

  switch (Type) {
    case Date:
      return value instanceof Date
        ? { isValid: true }
        : { isValid: false, reason: `${field} should be type of Date.` };
    case Number:
    case String:
    case Boolean:
      return value.constructor === Type
        ? { isValid: true }
        : {
            isValid: false,
            reason: `${field} should be type of ${Type.name}.`,
          };
    default:
      return {
        isValid: false,
        reason: `Unsupported type ${Type?.name} and/or field ${field}.`,
      };
  }
};

/**
 * Validates the fields of a given data object against a schema object.
 *
 * @param {SchemaObjectType} schema - The schema object to validate against.
 * @param {any} data - The data object to validate.
 * @return {boolean} Returns true if all fields in the data object are valid according to the schema object, otherwise false.
 */
const validateFields = (
  schema: SchemaObjectType,
  data: any,
): ValidationDataType => {
  for (const key in data) {
    const value = data[key];

    if (!schema[key]) {
      return { isValid: false, reason: 'Field not found in schema.' };
    }

    if (getIsSchemaStringType(schema[key])) {
      const validationData = validateField(schema[key], value, key);

      if (!validationData.isValid) {
        return {
          isValid: validationData.isValid,
          reason: validationData.reason,
        };
      }
    } else {
      const validationData = validateField(schema[key].type, value, key, {
        required: schema[key].required,
        nullable: schema[key].nullable,
      });

      if (!validationData.isValid) {
        return {
          isValid: validationData.isValid,
          reason: validationData.reason,
        };
      }
    }
  }

  return { isValid: true };
};

const createSchemeClassWithValue = (
  modelName: string,
  schema: SchemaObjectType,
) => {
  class SchemaWithValue {
    constructor(public value: any) {
      this.value = value;
    }

    static modelName?: string = modelName;
    static schema: SchemaObjectType = schema;
    static firestore = new FirestoreService();

    save() {
      return SchemaWithValue.add(this.value);
    }

    /**
     * Retrieves data based on the provided query.
     *
     * @param {GetQueryType[]} getQuery - The query parameters to retrieve data.
     * @return {any} The data retrieved based on the query.
     */
    static get(...getQuery: GetQueryType[]) {
      this._checkSchemaName();

      const parsedQuery = parseQuery(getQuery);

      return this.firestore.get(this.modelName as string, ...parsedQuery);
    }

    /**
     * Retrieves a document with the given ID.
     *
     * @param {string} id - The ID of the document to retrieve.
     * @return {type} description of return value
     */
    static getDoc(id: string) {
      this._checkSchemaName();

      return this.firestore.getDoc(this.modelName as string, id);
    }

    /**
     * Adds data to the Firestore.
     *
     * @param {any} data - The data to be added to the Firestore.
     * @return {any} The result of adding the data to the Firestore.
     */
    static add(data: any) {
      // TODO make typeof Something
      this._checkSchemaName();
      this._checkIsValid(data);

      return this.firestore.add(this.modelName as string, data);
    }

    /**
     * Edits a document in Firestore with the provided data and ID.
     *
     * @param {any} data - The data to edit the document with.
     * @param {string} id - The ID of the document to be edited.
     * @return {any} The result of editing the document in Firestore.
     */
    static edit(data: any, id: string) {
      // TODO make typeof Something
      this._checkSchemaName();
      this._checkIsValid(data);

      return this.firestore.edit(this.modelName as string, data, id);
    }

    /**
     * Deletes a document in Firestore based on the provided ID.
     *
     * @param {string} id - The ID of the document to be deleted.
     * @return {any} The result of deleting the document in Firestore.
     */
    static delete(id: string) {
      this._checkSchemaName();

      return this.firestore.delete(this.modelName as string, id);
    }

    /**
     * Checks if the model name is defined, throws an error if not.
     */
    static _checkSchemaName() {
      if (!this.modelName) {
        throw new Error('Model name is required');
      }
    }

    /**
     * Validates the provided data against the schema and throws an error if the data does not match.
     *
     * @param {any} data - The data to validate against the schema.
     */
    static _checkIsValid(data: any) {
      const validationData = validateFields(this.schema, data);

      if (!validationData.isValid) {
        throw new Error(
          validationData.reason || 'Provided object does not match the Schema.',
        );
      }
    }
  }

  return SchemaWithValue;
};

export { parseQuery, validateFields, createSchemeClassWithValue };
