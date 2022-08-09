export interface ItemData {
  name: string;
  onChain: boolean;
  verified?: boolean;
  dataUri?: string;
  metadataUri?: string;
}

export default interface CacheData {
  startDate?: any;
  authority?: string;
  program?: {
    config?: string;
    uuid?: string;
    collection?: string;
    candyMachine?: string;
  };
  items?: {
    [key: string]: ItemData;
  };
}
