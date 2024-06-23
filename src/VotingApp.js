import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Voting from './abis/Voting.json';

const VotingApp = () => {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [contract, setContract] = useState(null);
    const [candidate1Votes, setCandidate1Votes] = useState(0);
    const [candidate2Votes, setCandidate2Votes] = useState(0);

    useEffect(() => {
        const init = async () => {
            try {
                const web3 = new Web3('http://localhost:7545');
                setWeb3(web3);

                const accounts = await web3.eth.getAccounts();
                setAccounts(accounts);

                const networkId = await web3.eth.net.getId();
                const deployedNetwork = Voting.networks[networkId];
                if (!deployedNetwork) {
                    throw new Error("Contract not deployed on current network. Please migrate your contract.");
                }

                const instance = new web3.eth.Contract(
                    Voting.abi,
                    deployedNetwork.address,
                );
                setContract(instance);

                const candidate1Votes = await instance.methods.getVotes('Alice').call();
                const candidate2Votes = await instance.methods.getVotes('Bob').call();
                setCandidate1Votes(candidate1Votes);
                setCandidate2Votes(candidate2Votes);
            } catch (error) {
                console.error("Could not connect to contract or chain.", error);
            }
        };
        init();
    }, []);

    const vote = async (candidate) => {
        if (!contract) {
            console.error("Contract instance not initialized");
            return;
        }

        try {
            await contract.methods.vote(candidate).send({ from: accounts[0] });
            const candidate1Votes = await contract.methods.getVotes('Alice').call();
            const candidate2Votes = await contract.methods.getVotes('Bob').call();
            setCandidate1Votes(candidate1Votes);
            setCandidate2Votes(candidate2Votes);
        } catch (error) {
            console.error("Error while voting", error);
        }
    };

    if (!web3) {
        return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
        <div>
            <h1>Voting Platform</h1>
            <p>Alice: {candidate1Votes} votes</p>
            <p>Bob: {candidate2Votes} votes</p>
            <button onClick={() => vote('Alice')}>Vote for Alice</button>
            <button onClick={() => vote('Bob')}>Vote for Bob</button>
        </div>
    );
};

export default VotingApp;
