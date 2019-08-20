import { IEdge } from '../src/components/edge';
import { INode } from '../src/components/node';

export function isEdge(selected: IEdge | INode): selected is IEdge {
  if ((selected as IEdge).source && (selected as IEdge).target) {
    return true;
  }

  return false;
}
