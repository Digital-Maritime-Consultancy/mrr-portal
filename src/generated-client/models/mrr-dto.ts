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
import { OwnerDTO } from './owner-dto';
/**
 * Object representing a reference to another MRR
 * @export
 * @interface MrrDTO
 */
export interface MrrDTO {
    /**
     * The unique ID of the MRR
     * @type {number}
     * @memberof MrrDTO
     */
    id?: number;
    /**
     * The MRN namespace of the MRR
     * @type {string}
     * @memberof MrrDTO
     */
    mrnNamespace?: string;
    /**
     * The endpoint of the MRR
     * @type {string}
     * @memberof MrrDTO
     */
    endpoint?: string;
    /**
     * 
     * @type {OwnerDTO}
     * @memberof MrrDTO
     */
    owner?: OwnerDTO;
}