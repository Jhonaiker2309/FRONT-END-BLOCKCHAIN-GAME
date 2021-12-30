import { CONTRACT_ADDRESS, transformCharacterData} from "./constants";
import myEpicGame from "./utils/myEpicGame.json";
import React, { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import shawshanksGif from "./assets/shawshanks.gif";
import "./App.css";
import SelectCharacter from "./Components/SelectCharacter";
import { ethers } from "ethers";
import Arena from "./Components/Arena"
import LoadingIndicator from "./Components/LoadingIndicator";
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;




const App = () => {
	const [currentAccount, setCurrentAccount] = useState(null);
	const [characterNFT, setCharacterNFT] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


	const checkIfWalletIsConnected = async () => {
		const { ethereum } = window;

		if (!ethereum) {
			console.log("You don't have metamask");
            setIsLoading(false);
			return;
		} else {
			console.log("We have an ethereum object", ethereum);

			const accounts = await ethereum.request({ method: "eth_accounts" });

			if (accounts.length > 0) {
				const account = accounts[0];
				console.log("Found authorized account", account);
				setCurrentAccount(account);
			} else {
				console.log("Not authorized account found");
			}
		}

        setIsLoading(false)
	};

	const connectWalletAction = async () => {
		try {
			const { ethereum } = window;
			if (!ethereum) {
				console.log("Get metamask");
				return;
			}

			const accounts = await ethereum.request({
				method: "eth_requestAccounts",
			});

			const account = accounts[0];

			console.log("Connected", account);
			setCurrentAccount(account);
		} catch (error) {
			console.log(error);
		}
	};

	// Render Methods
	const renderContent = () => {
		
          if (isLoading) {
            return <LoadingIndicator />;
        }

		if (!currentAccount) {
			return (
				<div className="connect-wallet-container">
					<img src={shawshanksGif} alt="Shawshanks Redemption Gif" />
					<button
						className="cta-button connect-wallet-button"
						onClick={connectWalletAction}>
						Connect Wallet To Get Started
					</button>
				</div>
			);
			/*
			 * Scenario #2
			 */
		} else if (currentAccount && !characterNFT) {
			return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
		} else if (currentAccount && characterNFT) {
			return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT}/>;
		}
  }
	;

    const checkNetwork = async () => {
			try {
				if (window.ethereum.networkVersion !== "4") {
					alert("Please connect to Rinkeby!");
				}
			} catch (error) {
				console.log(error);
			}
		};

	useEffect(() => {
		
        setIsLoading(true);
        checkIfWalletIsConnected();
        checkNetwork();
	}, []);

    useEffect(() => {
			/*
			 * The function we will call that interacts with out smart contract
			 */
			const fetchNFTMetadata = async () => {
				console.log("Checking for Character NFT on address:", currentAccount);

				const provider = new ethers.providers.Web3Provider(window.ethereum);
				const signer = provider.getSigner();
				const gameContract = new ethers.Contract(
					CONTRACT_ADDRESS,
					myEpicGame.abi,
					signer,
				);

				const txn = await gameContract.checkIfUserHasNFT();
				if (txn.name) {
					console.log("User has character NFT");
					setCharacterNFT(transformCharacterData(txn));
				} 

                    setIsLoading(false);

			};

			/*
			 * We only want to run this, if we have a connected wallet
			 */
			if (currentAccount) {
				console.log("CurrentAccount:", currentAccount);
				fetchNFTMetadata();
			}
		}, [currentAccount]);
  

	return (
		<div className="App">
			<div className="container">
				<div className="header-container">
					<p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
					<p className="sub-text">Team up to protect the Metaverse!</p>
					{/* This is where our button and image code used to be!
					 *	Remember we moved it into the render method.
					 */}
					{renderContent()}
				</div>
				<div className="footer-container">
					<img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
					<a
						className="footer-text"
						href={TWITTER_LINK}
						target="_blank"
						rel="noreferrer">{`built with @${TWITTER_HANDLE}`}</a>
				</div>
			</div>
		</div>
	);
};

export default App;
