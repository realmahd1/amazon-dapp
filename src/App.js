import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

// Components
import Navigation from './components/Navigation';

// ABIs
import Dappazon from './abis/Dappazon.json';

// Config
import config from './config.json';
import Section from './components/Section';

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [dappazon, setDappazon] = useState(null)
  const [electronics, setElectronics] = useState(null);
  const [clothing, setClothing] = useState(null);
  const [toys, setToys] = useState(null);

  const loadBlockchainData = async () => {
    // Connect to blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();

    // Connect to smart contracts (Create JS Versions)
    const dappazon = new ethers.Contract(config[network.chainId].dappazon.address, Dappazon.abi, provider);
    setDappazon(dappazon);

    // Load products
    const items = [];
    for (let i = 0; i < 9; i++) {
      const item = await dappazon.items(i + 1);
      items.push(item);
    }

    const electronics = items.filter((item) => item.category === 'electronics')
    const clothing = items.filter((item) => item.category === 'clothing')
    const toys = items.filter((item) => item.category === 'toys')
    
    setClothing(clothing);
    setElectronics(electronics);
    setToys(toys);
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  const togglePop = () => {

  }

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <h2>Dappazon Best Sellers</h2>

      {electronics && clothing && toys && (
        <>
          <Section title={"Clothing & Jewelry"} items={clothing} togglePop={togglePop} />
          <Section title={"Electronics & Gadgets"} items={electronics} togglePop={togglePop} />
          <Section title={"Toys & Gaming"} items={toys} togglePop={togglePop} />
        </>
      )}
    </div>
  );
}

export default App;
