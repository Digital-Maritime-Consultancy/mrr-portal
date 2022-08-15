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
 * Object representing a reference to a maritime resource
 * @export
 * @interface MaritimeResourceDTO
 */
export interface MaritimeResourceDTO {
    /**
     * The MRN of the resource
     * @type {string}
     * @memberof MaritimeResourceDTO
     */
    mrn?: string;
    /**
     * The version of the resource
     * @type {number}
     * @memberof MaritimeResourceDTO
     */
    version?: number;
    /**
     * The location of the resource in the form of a URL
     * @type {string}
     * @memberof MaritimeResourceDTO
     */
    location?: string;
    /**
     * The title of the resource
     * @type {string}
     * @memberof MaritimeResourceDTO
     */
    title?: string;
    /**
     * A description of the resource
     * @type {string}
     * @memberof MaritimeResourceDTO
     */
    description?: string;
    /**
     * The unique ID of the resource in the MRR
     * @type {number}
     * @memberof MaritimeResourceDTO
     */
    id?: number;
}