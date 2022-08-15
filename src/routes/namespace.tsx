import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NamespaceSyntaxControllerApi, NamespaceSyntaxDTO } from "../generated-client";

export interface INamespaceProp{
    mrn: string;
}

export default function Namespace({mrn}: INamespaceProp) {
    const [namespace, setNamespace] = useState<NamespaceSyntaxDTO>();

    useEffect( () => {
        const apiHandler = new NamespaceSyntaxControllerApi();
        if (mrn.length) {
            apiHandler.getNamespaceSyntaxForMrn(mrn)
            .then(value => setNamespace(value.data));
        }
        
    }, [mrn]);

    return (
        <main style={{ padding: "1rem" }}>
            <p>{namespace?.namespace}</p>
            <p>{namespace?.regex}</p>
            <p>{namespace?.abnfSyntax}</p>
        </main>
    );
  }