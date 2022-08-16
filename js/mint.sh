#!/bin/bash

echo "Mint an NFT that points to a URL"

#echo "1. Editing Config Account/Uploading Assets"
#echo ""
#echo ">>>"
#$CMD_CMV1 update_config_account --keypair $WALLET_KEY $ASSETS_DIR --env $ENV_URL -c $CACHE_NAME -r $RPC -s $STORAGE
#EXIT_CODE=$?
#echo "<<<"
#echo ""

echo "Verifying Assets\n"
yarn candy:verifyAssets

echo "Uploading Assets\n"
yarn candy:upload -rcm

#cat ./.cache/devnet-example.json | grep -Eo '(https?|ftp|file)://[-A-Za-z0-9\+&@#/%?=~_|!:,.;]*[-A-Za-z0-9\+&@#/%=~_|]*' > "metadataUri.txt"
#< ./metadataUri.txt xargs -I % xdg-open %
#echo -n "" > "metadataUri.txt" #CLEARS FILE CONTENTS

cat ./.cache/devnet-example.json | grep -Eo '(https?|ftp|file)://[-A-Za-z0-9\+&@#/%?=~_|!:,.;]*[-A-Za-z0-9\+&@#/%=~_|]*(ext=txt)' > "dataUri.txt"
#echo "$(./dataUri.txt)" #OUTPUT FILE CONTENTS
#< ./dataUri.txt xargs -I % xdg-open %
cat dataUri.txt | xargs curl -L | xargs xdg-open
#echo -n "" > "dataUri.txt" #CLEARS FILE CONTENTS

node query.js > './assets2/output.txt'
echo $RANDOM | md5sum | head -c 30 >> './assets2/output.txt'
#echo -n "" > "" > "./assets2/output.txt" #clears output.txt file


#INFILE= $"./.cache/devnet-example.json"
#while IFS =$',' read -a "uuid" "candyMachine" "collection" "metadataUri" "dataUri" "name" "onChain" "verified"
#do
    #print "$dataUri"
#done 

#echo "Set Collection"
#yarn candy:collect

#echo "Verifying Upload Was Successful"
#yarn candy:verifyUpload

#echo "Minting One NFT"
#yarn candy:mintOne

#echo "Showing Data\n"
#yarn candy:show

#echo "Mint Multiple Tokens"
#yarn candy:mintMany