import { NamespaceSyntaxDTO } from "../generated-client";

const checkSyntax = (value: string, regexString: string) => {
    const regex = new RegExp(regexString);
    return regex.test(value);
}

export const checkMrnSyntax = (value: any, namespaceInfo?: NamespaceSyntaxDTO): boolean => {
    if (namespaceInfo && namespaceInfo.regex) {
        return checkSyntax(value, namespaceInfo.regex);
    }
    return false;
}

export const checkUrlSyntax = (value: any): boolean => {
    const urlRegexStr = '(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})';
    return checkSyntax(value, urlRegexStr);
}