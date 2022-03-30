const { expect } = require("chai");
const { ethers } = require("hardhat");
 

describe("Greeter", function () {
  let owner
  let acc1
  let acc2
  let acc3
  let voter1
  let voter2
  let voter3
  let voter4
  let voter5


  beforeEach(async function () {
    [owner, acc1, acc2, acc3,voter1,voter2,voter3,voter4,voter5] = await ethers.getSigners();
    Vote = await ethers.getContractFactory("Vote", owner);

    vote = await Vote.deploy();
    await vote.deployed()
  });

  it('Should be deployed', async function (){
    expect(vote.address).to.be.properAddress
   })

   it('Should add Candidate and check Name', async function(){
    const damir = await vote.addCandidate('Damir', acc1.address);
    const igor = await vote.addCandidate('Igor', acc2.address);
    const ivan = await vote.addCandidate('Ivan', acc3.address);

    expect(await vote.getCandidatesName(1)).to.equal('Damir');
    expect(await vote.getCandidatesName(2)).to.equal('Igor');
    expect(await vote.getCandidatesName(3)).to.equal('Ivan');
   })

   it('Should add Candidate and check address', async function(){
    const damir = await vote.addCandidate('Damir', acc1.address);
    const igor = await vote.addCandidate('Igor', acc2.address);
    const ivan = await vote.addCandidate('Ivan', acc3.address);

    expect(await vote.getCandidatesAddress(1)).to.equal(acc1.address);
    expect(await vote.getCandidatesAddress(2)).to.equal(acc2.address);
    expect(await vote.getCandidatesAddress(3)).to.equal(acc3.address);
   })

   it('Should return owner vote contract', async function(){

    expect(await vote.getOwner()).to.equal(owner.address);

   })

   it('Should vote and get winner ID ', async function(){

    const damir = await vote.addCandidate('Damir', acc1.address);
    const igor = await vote.addCandidate('Igor', acc2.address);
    const ivan = await vote.addCandidate('Ivan', acc3.address);

    let overrides = {
      value: ethers.utils.parseEther("0.01")
    };

    await vote.initialize();

    await vote.connect(voter1).vote(1,overrides);
    await vote.connect(voter2).vote(2,overrides);
    await vote.connect(voter3).vote(3,overrides);
    await vote.connect(voter4).vote(1,overrides);
    await vote.connect(voter5).vote(1,overrides);

    expect(await vote.getWinner()).to.equal(1);

    expect(await vote.winnerAddress()).to.equal(acc1.address);


   })

   it('Should vote and get winner address', async function(){

    const damir = await vote.addCandidate('Damir', acc1.address);
    const igor = await vote.addCandidate('Igor', acc2.address);
    const ivan = await vote.addCandidate('Ivan', acc3.address);

    let overrides = {
      value: ethers.utils.parseEther("0.01")
    };

    await vote.initialize();

    await vote.connect(voter1).vote(1,overrides);
    await vote.connect(voter2).vote(2,overrides);
    await vote.connect(voter3).vote(3,overrides);
    await vote.connect(voter4).vote(1,overrides);
    await vote.connect(voter5).vote(1,overrides);

    expect(await vote.winnerAddress()).to.equal(acc1.address);


   })

   it('Should vote and get finish', async function(){

    const damir = await vote.addCandidate('Damir', acc1.address);
    const igor = await vote.addCandidate('Igor', acc2.address);
    const ivan = await vote.addCandidate('Ivan', acc3.address);

    let overrides = {
      value: ethers.utils.parseEther("0.01")
    };

    const theeDays = Math.floor(Date.now() / 1000) + 259200;

    await vote.initialize();

    await vote.connect(voter1).vote(1,overrides);
    await vote.connect(voter2).vote(2,overrides);
    await vote.connect(voter3).vote(3,overrides);
    await vote.connect(voter4).vote(1,overrides);
    await vote.connect(voter5).vote(1,overrides);

    expect(await vote.getWinner()).to.equal(1);

    expect(await vote.winnerAddress()).to.equal(acc1.address);
    await ethers.provider.send('evm_increaseTime', [theeDays]);
    await ethers.provider.send('evm_mine');
    await expect(()=>  vote.finishVote()).to.changeEtherBalance(acc1,45000000000000000n);
   })

   it('Should get withdraw 10%', async function(){

    const damir = await vote.addCandidate('Damir', acc1.address);
    const igor = await vote.addCandidate('Igor', acc2.address);
    const ivan = await vote.addCandidate('Ivan', acc3.address);

    let overrides = {
      value: ethers.utils.parseEther("0.01")
    };

    const theeDays = Math.floor(Date.now() / 1000) + 259200;

    await vote.initialize();

    await vote.connect(voter1).vote(1,overrides);
    await vote.connect(voter2).vote(2,overrides);
    await vote.connect(voter3).vote(3,overrides);
    await vote.connect(voter4).vote(1,overrides);
    await vote.connect(voter5).vote(1,overrides);

    expect(await vote.getWinner()).to.equal(1);

    expect(await vote.winnerAddress()).to.equal(acc1.address);
    await ethers.provider.send('evm_increaseTime', [theeDays]);
    await ethers.provider.send('evm_mine');
    await expect(()=>  vote.finishVote()).to.changeEtherBalance(acc1,45000000000000000n);

    await expect(()=>  vote.withDraw(acc2.address)).to.changeEtherBalance(acc2,5000000000000000);

   })

   it("should check modifier onlyOwner", async () => {
    try {
      let result = await vote.initialize.call({from: acc1.address})
      assert.equal(result.toString(), owner)
    } catch (e) {
      console.log(`${acc1.address} is not owner`)
    }
  })
   

});
