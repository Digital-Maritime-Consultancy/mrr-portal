import * as d3 from 'd3';
import { useEffect, useRef, useState } from "react";
import './d3.scss';
import Tree from 'react-d3-tree';
import { MaritimeResourceDTO } from '../../generated-client';
import { RawNodeDatum } from 'react-d3-tree/lib/types/common';
import { generateTree } from './util/treeGenerator';

const defaultData = {
  name: "urn",
  attributes: {
      "id": 0
  },
  children: [
      {
          name: "mrn",
          attributes: {
              id: 1,
              parentId: 0
          },
      }
  ]
}

export interface ID3TreeProp{
  resource: MaritimeResourceDTO[];
  onSelect: (mrn: string) => void;
}


export default function D3Tree({
  resource,
  onSelect,
}: ID3TreeProp) {
  const [data, setData] = useState<RawNodeDatum[]>([]);
  useEffect(() => {
    setData(generateTree(resource));
  },[resource]);
  return (
    // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
    <div id="treeWrapper" style={{ width: '100%', height: '30em', backgroundColor: '#D8E1E9' }}>
      <Tree data={data.length ? data : defaultData}
        collapsible={false}
        rootNodeClassName="node__root"
        branchNodeClassName="node__branch"
        leafNodeClassName="node__leaf"
        onNodeMouseOver={(e: any) => onSelect(e.data.attributes.mrn)}
      />
    </div>
  );
}