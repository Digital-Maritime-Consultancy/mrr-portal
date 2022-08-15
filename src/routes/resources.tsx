import { useEffect, useState } from "react";
import D3Tree from "../components/d3/d3tree";
import { MaritimeResourceControllerApi, MaritimeResourceDTO } from "../generated-client";

export default function Resources() {
  const [resources, setResources] = useState<MaritimeResourceDTO[]>([]);

  useEffect(() => {
    const apiHandler = new MaritimeResourceControllerApi();
    apiHandler.getAllMaritimeResources()
      .then((res: any) => res.data)
      .then((data: MaritimeResourceDTO[]) => setResources(data))
      .catch(e => alert(e));
  }, []);
  return (
    <div>
      <D3Tree resource={resources}></D3Tree>
    </div>
  )
}