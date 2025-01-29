import { useState } from 'react';
import {ethers, formatEther} from "ethers";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import abi from './abi.json';

function App() {
  const [balance, setBalance] = useState();
  const [depositAmount, setDepositAmount] = useState();
  const [withdrawAmount, setWithdrawAmount] = useState();
  
  const contractAddress = "0x1f017d16505e53638b00d23072f03d818518e1f3";

  const requestAccount = async () => {
    await window.ethereum.request({method: "eth_requestAccounts"});
  }


  async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);

        const currentBalance = await contract.getBalance();
        const formatBal = formatEther(currentBalance);

        setBalance(formatBal);
        toast.success('Balance updated!');
      } catch (error) {
        toast.error('Failed to fetch balance'); 
        console.log(error)
      }
    } else {
      requestAccount()
    }

  }

  async function handleDeposit() {
    if ( typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        
        const tx = await contract.deposit(depositAmount);
        toast.info('Deposit in progress...', { autoClose: false, toastId: 'deposit' });
        
        const receipt = await tx.wait();
        toast.dismiss('deposit');
        toast.success('Deposit successful!');
        setDepositAmount(receipt);
        
        getBalance();
      } catch (error) {
        toast.error(error.message || 'Failed to deposit');
      }
    } else {
      requestAccount();
    }

    
  }

  async function handleWithdraw() {
   if(typeof window.ethereum !== "undefined") {

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      
      const tx = await contract.withdraw(withdrawAmount);
      toast.info('Withdrawal in progress...', { autoClose: false, toastId: 'withdraw' });
      
      const receipt = await tx.wait();
      toast.dismiss('withdraw');
      toast.success('Withdrawal successful!');
      setWithdrawAmount(receipt);

      getBalance();
    } catch (error) {
      console.log(error)
      toast.error(error.message || 'Failed to withdraw');
    }
  } else {
    requestAccount()
  }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-md mx-auto backdrop-blur-lg bg-white/10 rounded-xl shadow-2xl overflow-hidden p-6 border border-white/20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            ETH Wallet
          </h1>
       </div>
        

        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <h3 className="text-lg mb-3 text-white">Deposit</h3>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Amount in ETH"
              className="w-full bg-white/5 border border-white/20 p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-gray-400"
            />
            <button 
              onClick={handleDeposit}
              className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Deposit
            </button>
          </div>

          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <h3 className="text-lg mb-3 text-white">Withdraw</h3>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Amount in ETH"
              className="w-full bg-white/5 border border-white/20 p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-gray-400"
            />
            <button 
              onClick={handleWithdraw}
              className="w-full bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Withdraw
            </button>
          </div>


        <div className="mb-8 p-4 rounded-lg bg-white/5 border border-white/10">
          <h2 className="text-xl mb-3 text-white">Balance: {balance} ETH</h2>
        </div>
        </div>
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  )
}

export default App