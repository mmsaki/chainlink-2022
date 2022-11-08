import {ethers} from "./ethers-5.1.esm.min.js";
import {contractAddress, abi} from "./constants.js";

const connectButton = document.getElementById("connect-button");
const balanceButton = document.getElementById("balance-button");
const fundButton = document.getElementById("fund-button");

connectButton.onclick = connect;
balanceButton.onclick = getBalance;
fundButton.onclick = fund;

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            window.ethereum.request({ method: "eth_requestAccounts" });
        } catch (error) {
            console.log(error)
        }
        const accounts = await window.ethereum.request({ method: "eth_accounts"});
        connectButton.innerHTML = accounts[0];
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const account = await provider.send("eth_requestAccounts", []);
        const balance = await provider.getBalance(account[0]);
        console.log(ethers.utils.formatEther(balance));
    }
}

async function fund() {
    const ethAmount = document.getElementById("eth-input").value;
    console.log(`funding with ${ethAmount}...`);
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = new provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount)
            })
            await transactionResponse.wait(1);
        } catch (error) {
            console.log(error);
        }

    }
}