/* tslint:disable */
/* eslint-disable */
/**
 * The Maritime Resource Registry API
 * The Maritime Resource Registry can be used to create and query resources that are identified by an MRN
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
/**
 * 
 * @export
 * @interface SyntaxCreationResult
 */
export interface SyntaxCreationResult {
    /**
     * 
     * @type {string}
     * @memberof SyntaxCreationResult
     */
    code?: SyntaxCreationResultCodeEnum;
    /**
     * 
     * @type {string}
     * @memberof SyntaxCreationResult
     */
    namespace?: string;
    /**
     * 
     * @type {string}
     * @memberof SyntaxCreationResult
     */
    regex?: string;
    /**
     * 
     * @type {string}
     * @memberof SyntaxCreationResult
     */
    message?: string;
}

/**
    * @export
    * @enum {string}
    */
export enum SyntaxCreationResultCodeEnum {
    CREATING = 'CREATING',
    ERROR = 'ERROR',
    OK = 'OK'
}

