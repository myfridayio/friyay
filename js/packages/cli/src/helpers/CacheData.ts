export interface Item {
  name: string;
  onChain: boolean;
  verified: boolean;
  dataUri?: string;
  metadataUri?: string;
}

export default interface CacheData {
  program: {
    config?: string;
  };
  items: {
    [key: string]: Item;
  };
}
