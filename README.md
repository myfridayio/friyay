#	**FRIDAY**


##	---INSTALL Virtual Box---
Install VirtualBox or a compatible hypervisor
VirtualBox download: https://www.virtualbox.org/wiki/Downloads 

##	---DOWNLOAD the Friyay VM---
It is packaged as an Open Virtualization Format (OVF) appliance
http://solana-hackathon-friyay.s3-website.us-east-2.amazonaws.com/ 

##	---IMPORT VM into VirtualBox---
Instructions: https://docs.oracle.com/en/virtualization/virtualbox/6.0/user/ovf.html 

Start VM and log in with the user fri

##	cd into the js directory 
####	`cd ./friyay/js`

##	Ensure that you have nodejs version 16.0.0
####	`node -v `
####	'sudo npm install -g node@16.0.0'

##	Install node-semver if needed
####	`sudo apt install node-semver`

##	Install node dependencies
####	`npm install`

##	Install ts-node`
####	`sudo npm install --global ts-node --legacy-peer-deps`

##	Install Curl
####	`npm i curl`

##	Run False Yeezy case by running with the 
####	`node badge.mjs -i ABVUG4ZW9bE2RWCBDCyaEtRoEVkdYFRZTeQZ2xgToJeg`

##	Run True Yeezy Case
####	`node badge.mjs -i 7b423WXM5EDq1sBc5XgWH7jJQ98PG6RA6r4QyE9yij7p`

This will query the users data using a graphql api endpoint to Firebase to see if it matches the requirements of being a TRUE YEEZY. Once the user qualifies, Assets will assemble, Assets will be verified, Assets will upload, Collection is set, Upload will be verified and successfully Mint the TRUE YEEZY Badge NFT.

This will also output a link to the successfully minted NFT on https://explorer.solana.com/ 


##	Run License NFT
####	`node license.mjs -i 7b423WXM5EDq1sBc5XgWH7jJQ98PG6RA6r4QyE9yij7p`

This will Create the License NFT for the generated Badge NFT. Once run is complete, it will output the url to verify the successfully minted License NFT.

##	Sign License NFT
####	`node sign.js`

This will allow the brand to verify the TRUE YEEZY nft via the license by adding a signature and encrypting. The Bearer token will be outputed to the terminal.

##	Authorize License NFT
###	`node authorize.js`


This will grab the encrypted signature and decrypt using the public key and output that the authorization is a valid token.




