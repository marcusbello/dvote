// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
  address public owner;
  mapping(string => uint256) public votes;
  mapping(address => bool) public hasVoted;

  string public candidate1;
  string public candidate2;

  event VoteCast(address voter, string candidate);

  constructor(string memory _candidate1, string memory _candidate2) {
        owner = msg.sender;
        candidate1 = _candidate1;
        candidate2 = _candidate2;
  }

  function vote(string memory candidate) public {
        require(!hasVoted[msg.sender], "You have already voted");
        require(keccak256(abi.encodePacked(candidate)) == keccak256(abi.encodePacked(candidate1)) ||
                keccak256(abi.encodePacked(candidate)) == keccak256(abi.encodePacked(candidate2)), "Invalid candidate");

        votes[candidate]++;
        hasVoted[msg.sender] = true;

        emit VoteCast(msg.sender, candidate);
  }

  function getVotes(string memory candidate) public view returns (uint256) {
        return votes[candidate];
  }

}
