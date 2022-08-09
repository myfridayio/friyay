import Manifest from '../../helpers/Manifest';

/**
 * Set an asset's manifest from the filesystem & update it with the link
 * to the asset's image/animation link, obtained from signing the asset image/animation DataItem.
 *  Original function getUpdatedManifest from arweave-bundle
 */
export async function setImageUrlManifest(
  manifestString: string,
  dataUri: string,
): Promise<Manifest> {
  const manifest: Manifest = JSON.parse(manifestString);
  const originalImage = manifest.file;
  manifest.file = dataUri;
  manifest.properties.files.forEach(file => {
    if (file.uri === originalImage) file.uri = dataUri;
  });
  return manifest;
}
