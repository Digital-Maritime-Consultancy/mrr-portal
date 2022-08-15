import * as d3 from 'd3';
import { useEffect, useRef, useState } from "react";
import './d3.scss';
import Tree from 'react-d3-tree';
import { MaritimeResourceDTO } from '../../generated-client';
import { generateTree, ITreeElement } from './model/TreeElement';
import { RawNodeDatum } from 'react-d3-tree/lib/types/common';


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
}


export default function D3Tree({
  resource,
}: ID3TreeProp) {
  const [data, setData] = useState<RawNodeDatum[]>([]);
  useEffect(() => {
    setData(generateTree(resource));
  },[resource]);
  return (
    // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
    <div id="treeWrapper" style={{ width: '50em', height: '50em', backgroundColor: 'green' }}>
      <Tree data={data.length ? data : defaultData}
        onNodeMouseOver={(e: any) => console.log(e)}
      />
    </div>
  );
}