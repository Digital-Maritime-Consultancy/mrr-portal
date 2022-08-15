import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MaritimeResourceControllerApi, MaritimeResourceDTO, PageMaritimeResourceDTO } from "../generated-client";

export interface IResourceProp{
    resources: MaritimeResourceDTO[];
    mrn: string;
}

export default function Resource({resources, mrn}: IResourceProp) {
    const [resource, setResource] = useState<MaritimeResourceDTO | undefined>();
    
    useEffect( () => {
        setResource(resources.filter(r => r.mrn === mrn).pop());
    }, [mrn]);
    return (
        <main style={{ padding: "1rem" }}>
            <h1>{resource?.title}</h1>
            <p>{resource?.description}</p>
            <p>{resource?.location}</p>
        </main>
    );
  }