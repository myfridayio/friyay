export default interface Manifest {
  name: string;
  symbol?: string;
  file: string;
  description: string;
  seller_fee_basis_points: number;
  collection: {};
  properties: {
    files: { uri: string; type: string }[];
    category: string;
    creators: { address: string; share: number }[];
  };
  attributes: { trait_type: string; value: string }[];
}
