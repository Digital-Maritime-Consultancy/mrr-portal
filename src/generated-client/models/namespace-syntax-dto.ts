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
 * Object representing the syntax definition for a MRN namespace
 * @export
 * @interface NamespaceSyntaxDTO
 */
export interface NamespaceSyntaxDTO {
    /**
     * The MRN namespace that this syntax describes
     * @type {string}
     * @memberof NamespaceSyntaxDTO
     */
    mrnNamespace?: string;
    /**
     * The ABNF syntax
     * @type {string}
     * @memberof NamespaceSyntaxDTO
     */
    abnfSyntax?: string;
    /**
     * A regular expression derived from the ABNF syntax
     * @type {string}
     * @memberof NamespaceSyntaxDTO
     */
    regex?: string;
    /**
     * 
     * @type {OwnerDTO}
     * @memberof NamespaceSyntaxDTO
     */
    owner?: OwnerDTO;
    /**
     * The unique ID of the namespace syntax
     * @type {number}
     * @memberof NamespaceSyntaxDTO
     */
    id?: number;
}
