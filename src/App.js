import { ethers } from 'ethers'
import { useEffect, useState } from 'react'

// Components
import Navigation from './components/Navigation'

// ABIs

// Config

function App() {
  const [account, setAccount] = useState(null);

  const loadBlockchainData = async () => {
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <h2>Welcome to Dappazon</h2>

    </div>
  );
}

export default App;
