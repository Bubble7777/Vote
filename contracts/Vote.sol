//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/Pausable.sol";

contract Vote is Pausable {
    
    struct Candidate {
        uint256 id;
        string name;
        uint256 totalVotes;
        address candidateAddress;
    }

    address owner;  
    uint256 private countCandidates; 
    uint256 private _startDate; 
    uint256 private _threeDays; 
    //address payable winner;

    mapping (address => bool) private voters; 
    mapping(uint256 => Candidate) public candidates; 

    constructor(){
         owner = msg.sender;
         _pause(); 
    }

    modifier onlyOwner(){
        require(msg.sender == owner,"Ownable: caller is not the owner");
        _;
    }

    event votedEvent(uint indexed candidateId);
 
    function initialize()
        public 
        onlyOwner        
        whenPaused
    {
        
        _startDate = block.timestamp; 
        _threeDays = _startDate + 259200; 
        _unpause(); 
    }

    function addCandidate(string memory new_name, address new_address) public onlyOwner whenPaused returns(bool){
        countCandidates++;
        candidates[countCandidates] = Candidate(countCandidates, new_name, 0, new_address);
        return true;
    }

    function getCandidatesName(uint256 candidateId)public view returns(string memory){
        return candidates[candidateId].name;
    }

    function getCandidatesAddress(uint256 candidateId)public view returns(address){
        return candidates[candidateId].candidateAddress;
    }

    function getOwner()public view returns(address){
        return owner;
    }

     
    function vote (uint256 candidateId) public whenNotPaused payable {
        require(msg.value == 0.01 ether, "Pay only 0.01 ether");
        require(!voters[msg.sender], "You have already voted");
        require(candidateId > 0 && candidateId <= countCandidates, "There is no such candidate.");
        require(_threeDays >= block.timestamp, "3 days have not passed");
        voters[msg.sender] = true;
        candidates[candidateId].totalVotes++;
        emit votedEvent(candidateId);
    }
    
    function finishVote() public whenNotPaused {
        require( block.timestamp >= _threeDays, "3 days have not passed");
        address  winner =  winnerAddress();
        uint256 result = address(this).balance * 90 / 100; 
        payable(winner).transfer(result);
        _pause();
    }

    function withDraw(address payable _to) external onlyOwner{
        require( block.timestamp >= _threeDays, "3 days have not passed");
        _to.transfer(address(this).balance);
    }

     function getWinner() public view returns(uint256 winningProposal)
    {

        uint winningVoteCount = 0;
        for (uint i = 0; i < countCandidates; i++) {
            if (candidates[i].totalVotes > winningVoteCount) {
                winningVoteCount = candidates[i].totalVotes;
                winningProposal = i;
            }
        }
        return winningProposal;
    }  

    function winnerAddress() public view returns(address winner_)
    {
        winner_ = payable(candidates[getWinner()].candidateAddress);
        return winner_;
    }
}
