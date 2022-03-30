require("@nomiclabs/hardhat-web3");
require('dotenv').config()
const { task } = require('hardhat/config')
const Web3 = require('web3')


const addressContract = '0x19c75fd182652eC7f265194B578340A29b06DFD7';
const DonatArtifact = require('../artifacts/contracts/Vote.sol/Vote.json');
const contract = new web3.eth.Contract(DonatArtifact,addressContract)

async function addCandidate() {
    
    await contract.addCandidate( 'Damir', '0x2704486D3d01dD34989Ada387e364CC3a6BfbEAC',)
    await contract.addCandidate( Ivan, '0xfB603D5F84b445aA302B97E42934f1D22FFA92C4',)
    return contract  
}

task("addCandidate", "Add new Candidate in Vote")
    .setAction(async () => {
        
            await addCandidate()
            let candidate1 = await contract.getCandidatesName(1)
            let candidate2 = await contract.getCandidatesName(2)
            console.log('Candidtae 1:', candidate1) 
            console.log('Candidtae 2:', candidate2) 
})

 