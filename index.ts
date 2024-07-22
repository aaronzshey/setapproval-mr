import { setBalance } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "ethers";
import hardhat from "hardhat";
import * as contract from "./artifacts/contracts/MyNFT.sol/MyNFT.json";

async function main() {
  const myAddress = "0x06b0ED5338e36623b859081B0692F7dE33aF67E5";
  const firstRecipient = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const secondRecipient = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  await setBalance("0x06b0ED5338e36623b859081B0692F7dE33aF67E5", 99999999999999999999999999999);
  //@ts-ignore
  const impersonatedSigner = await hardhat.ethers.getImpersonatedSigner(
    myAddress
  );

  const myContractFactory = new ethers.ContractFactory(
    contract.abi,
    contract.bytecode,
    impersonatedSigner
  );

  const contractFactoryTxn = await myContractFactory.deploy(myAddress);
  await contractFactoryTxn.waitForDeployment();
  const factoryAddress = await contractFactoryTxn.getAddress();

  const myNFTContract = new ethers.Contract(
    factoryAddress,
    contract.abi,
    impersonatedSigner
  );

  let txn = await myNFTContract.safeMint(
    impersonatedSigner.address  );

  await txn.wait();
  console.log(`Mint successful: ${txn.hash}`);

  await myNFTContract.safeTransferFrom(myAddress, firstRecipient, 0);
  await myNFTContract.setApprovalForAll(myAddress, true);
  await myNFTContract.safeTransferFrom(firstRecipient, secondRecipient, 0);


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
