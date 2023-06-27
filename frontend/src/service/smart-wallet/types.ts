export enum AgoricChainStoragePathKind {
  Children = 'children',
  Data = 'data',
}

export type UpdateHandler<T> = (latestValue: T) => void;
