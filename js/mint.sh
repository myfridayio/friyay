#!/bin/bash

echo "Mint an NFT that points to a URL"

#echo "1. Editing Config Account/Uploading Assets"
#echo ""
#echo ">>>"
#$CMD_CMV1 update_config_account --keypair $WALLET_KEY $ASSETS_DIR --env $ENV_URL -c $CACHE_NAME -r $RPC -s $STORAGE
#EXIT_CODE=$?
#echo "<<<"
#echo ""

#solana-keygen new -o ~/.config/solana/id.json
echo "Are you a True Kanye Fan?"
echo "-------------------------"
echo "Enter user ID:"
read USER_ID
echo ""

APIKEY="saopedro::stepzen.net+1000::5c45e0f566f813a29c8d7846ed6b860bbec36a4eb91b1cabb42c681ddb25c685"
VERIFICATION_URL=`node verification.js`
CURL="curl -h \"Authorization: apikey $APIKEY\" $VERIFICATION_URL"
verify() {
    curl --no-progress-meter -H "Authorization: apikey $APIKEY" $VERIFICATION_URL
}
OUTPUT=`verify`

#echo $OUTPUT
if node ./isTrueYeezy.js $OUTPUT; then
   echo "we should mint the NFT";
else
   echo "we should NOT mint the NFT";
fi


echo "{
    \"name\": \"1\",
    \"symbol\": \"\",
    \"file\": \"0.png\",
    \"image\": \"0.png\",
    \"properties\": {
      \"files\": [{ \"uri\": \"0.png\", \"type\": \"image/png\" }],
      \"category\": \"image\",
      \"VerificationURL\": \"$VERIFICATION_URL\",
      \"creators\": [
        {
          \"address\": \"CV6uQbknPdCVPQunQHqosyvdHJeTuq3629VJdzs8AYjV\",
          \"share\": 100
        }
      ]
    },
    \"description\": \"\",
    \"seller_fee_basis_points\": 500,
    \"attributes\": [
      { \"trait_type\": \"background\", \"value\": \"white\" },
      { \"trait_type\": \"text\", \"value\": \"red\"}
    ],
    \"collection\": {}
  }" > ./assets/NFT1/0.json #create json file associated with true kanye nft


#echo "Verifying True Kanye Fan NFT"
#yarn candy:verifyAssets1 #MINTING 
#yarn candy:upload1 -rcm #UPLOADING  
echo "Set Collection"
#yarn candy:collect #SET COLLECTION 
echo "Verifying Upload Was Successful"
#yarn candy:verifyUpload #VERIFYING UPLOAD 
echo "Minting True Kanye Fan NFT"
#yarn candy:mintOne #MINTING 
#echo "Showing Data" #Commenting to unclutter terminal for token address
#yarn candy:show #SHOWING 
qrencode -s 9 -l H -o "qr.png" $VERIFICATION_URL
node combineImages.js ./assets/NFT1/0.png --qr ./qr.png --onto ./kanye.png #Puts QR code on NFT1
rm ./qr.png


#License NFT

#echo "Verifying Assets"
#yarn candy:verifyAssets

#echo "Uploading Assets"
#yarn candy:upload -rcm

#cat ./.cache/devnet-example.json | grep -Eo '(https?|ftp|file)://[-A-Za-z0-9\+&@#/%?=~_|!:,.;]*[-A-Za-z0-9\+&@#/%=~_|]*' > "metadataUri.txt"
#< ./metadataUri.txt xargs -I % xdg-open %
#echo -n "" > "metadataUri.txt" #CLEARS FILE CONTENTS

#cat ./.cache/devnet-example.json | grep -Eo '(https?|ftp|file)://[-A-Za-z0-9\+&@#/%?=~_|!:,.;]*[-A-Za-z0-9\+&@#/%=~_|]*(ext=txt)' > "dataUri.txt"
#echo "$(./dataUri.txt)" #OUTPUT FILE CONTENTS
#< ./dataUri.txt xargs -I % xdg-open %
#cat dataUri.txt | xargs curl -L | xargs xdg-open
#echo -n "" > "dataUri.txt" #CLEARS FILE CONTENTS

#node query.js > './assets2/output.txt'
#echo $RANDOM | md5sum | head -c 30 >> './assets2/output.txt'
#echo -n "" > "" > "./assets2/output.txt" #clears output.txt file

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