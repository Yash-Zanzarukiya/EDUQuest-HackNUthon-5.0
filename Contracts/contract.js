import { ethers } from "ethers";

const registerCertificates = async (name, uni, certificateId, gradYear) => {
  try {
    const { ethereum } = window;

    const CONTRACT_ABI = [
      {
        inputs: [
          {
            internalType: "string",
            name: "_certificateId",
            type: "string",
          },
        ],
        name: "getCertificate",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
          {
            internalType: "string",
            name: "",
            type: "string",
          },
          {
            internalType: "string",
            name: "",
            type: "string",
          },
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "_certificateId",
            type: "string",
          },
          {
            internalType: "string",
            name: "_name",
            type: "string",
          },
          {
            internalType: "string",
            name: "_uni",
            type: "string",
          },
          {
            internalType: "string",
            name: "_gradYear",
            type: "string",
          },
        ],
        name: "registerCertificate",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    const CONTRACT_ADDRESS = "0x786759011b97c10d3262b0e7a256eb9433b9744b";

    if (ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const certificateContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      return await certificateContract.registerCertificate(name, uni, certificateId, gradYear);
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
};

const getCertificates = async (product_id) => {
  try {
    const { ethereum } = window;
    const CONTRACT_ABI = [
      {
        inputs: [
          {
            internalType: "string",
            name: "_certificateId",
            type: "string",
          },
        ],
        name: "getCertificate",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
          {
            internalType: "string",
            name: "",
            type: "string",
          },
          {
            internalType: "string",
            name: "",
            type: "string",
          },
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "_certificateId",
            type: "string",
          },
          {
            internalType: "string",
            name: "_name",
            type: "string",
          },
          {
            internalType: "string",
            name: "_uni",
            type: "string",
          },
          {
            internalType: "string",
            name: "_gradYear",
            type: "string",
          },
        ],
        name: "registerCertificate",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    const CONTRACT_ADDRESS = "0x786759011b97c10d3262b0e7a256eb9433b9744b";

    if (ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);

      const certificateContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      return await certificateContract.getCertificate(product_id);
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
};

export { registerCertificates, getCertificates };
