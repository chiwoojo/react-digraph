import { IEdge } from '../src/components/edge';
import { INode } from '../src/components/node';

export function isNode(selected: IEdge | INode): selected is INode {
  if (
    (selected as INode).title &&
    !(selected as IEdge).source &&
    !(selected as IEdge).target
  ) {
    return true;
  }

  return false;
}
