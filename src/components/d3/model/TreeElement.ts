import { RawNodeDatum } from "react-d3-tree/lib/types/common";
import { MaritimeResourceDTO } from "../../../generated-client";

const nest = (items: RawNodeDatum[], id:number | undefined = undefined, link = 'parentId'): RawNodeDatum[] =>
  items
    .filter((item: RawNodeDatum) => item.attributes!.parentId === id)
    .map((item: RawNodeDatum) => ({ ...item, children: nest(items, item.attributes!.id as number) } as RawNodeDatum))
    .map((item: RawNodeDatum) => ({ ...item, children: item.children?.length ? item.children : undefined } as RawNodeDatum));



export const generateTree = (data: MaritimeResourceDTO[]): RawNodeDatum[] => {
    const tests: RawNodeDatum[] = [];
    data.forEach((d: MaritimeResourceDTO) => {
        let goThrough = false;
        let prevIndex = -1;
        d.mrn?.split(':').forEach(s => {
            if(tests.filter(t => t.name === s).length === 0) {
                const parent = tests.filter(t => t.name === d.mrn?.slice(0, d.mrn.indexOf(s) -1).split(":").pop());
                if (parent.length > 0) {
                    tests.push({
                        name: s,
                        attributes: {
                            id: tests.length,
                            mrn: d.mrn!.slice(0,d.mrn!.lastIndexOf(s)+s.length),
                            title: d.title!,
                            location: d.location!,
                            description: d.description!,
                            parentId: !goThrough ? parent[0].attributes!.id : prevIndex
                        }
                    });
                    goThrough = true;
                } else {
                    tests.push({
                    name: s,
                    attributes: {
                        id: tests.length,
                        mrn: d.mrn!.slice(0,d.mrn!.lastIndexOf(s)+s.length),
                        title: d.title!,
                        location: d.location!,
                        description: d.description!,
                    }});
                }
            } else {
                if (goThrough) {
                    tests.push({
                        name: s,
                        attributes: {
                            id: tests.length,
                            parentId: prevIndex,
                            mrn: d.mrn!.slice(0,d.mrn!.lastIndexOf(s)+s.length),
                            title: d.title!,
                            location: d.location!,
                            description: d.description!,
                        }});
                }
            }
            prevIndex = tests.length-1;
        }
      );
    });
    return nest(tests);
}