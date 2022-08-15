import { useEffect, useState } from "react";
import D3Tree from "../components/d3/d3tree";
import { MaritimeResourceControllerApi, MaritimeResourceDTO } from "../generated-client";

export interface IResourcesProp{
  resources: MaritimeResourceDTO[];
  onSelect: (mrn: string) => void;
}

export default function Resources({resources, onSelect}: IResourcesProp) {
  
  const onSelectMrn = async (mrn: string): Promise<void> => {
    onSelect(mrn);
  }
  return (
    <div>
      <D3Tree resource={resources} onSelect={onSelectMrn}></D3Tree>
    </div>
  )
}