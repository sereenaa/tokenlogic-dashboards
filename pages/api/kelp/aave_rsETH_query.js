import { ethers } from 'ethers';

// Aave V3 Protocol Data Provider ABI - just the function we need
const PROTOCOL_DATA_PROVIDER_ABI = [
  "function getUserReserveData(address asset, address user) external view returns (uint256 currentATokenBalance, uint256 currentStableDebt, uint256 currentVariableDebt, uint256 principalStableDebt, uint256 scaledVariableDebt, uint256 stableBorrowRate, uint256 liquidityRate, uint40 stableRateLastUpdated, bool usageAsCollateralEnabled)"
];

const PROTOCOL_DATA_PROVIDER_ADDRESS = "0x41393e5e337606dc3821075Af65AeE84D7688CBD";
const RSETH_ADDRESS = "0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userAddress, blockHeight } = req.body;

  if (!userAddress) {
    return res.status(400).json({ error: 'Missing user address' });
  }

  try {
    // Connect to Ethereum node
    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    console.log(provider)
    
    // Create contract instance
    const contract = new ethers.Contract(
      PROTOCOL_DATA_PROVIDER_ADDRESS, 
      PROTOCOL_DATA_PROVIDER_ABI, 
      provider
    );

    // Call getUserReserveData with optional blockHeight
    const options = blockHeight ? { blockTag: parseInt(blockHeight) } : {};
    const userData = await contract.getUserReserveData(RSETH_ADDRESS, userAddress, options);

    // Format the response
    const response = {
      currentATokenBalance: userData[0].toString(),
      // currentStableDebt: userData[1].toString(),
      // currentVariableDebt: userData[2].toString(),
      // principalStableDebt: userData[3].toString(),
      // scaledVariableDebt: userData[4].toString(),
      // stableBorrowRate: userData[5].toString(),
      // liquidityRate: userData[6].toString(),
      // stableRateLastUpdated: userData[7].toString(),
      // usageAsCollateralEnabled: userData[8],
      // // Add formatted values (in ether units)
      formatted: {
        currentATokenBalance: ethers.formatUnits(userData[0], 18),
        // currentStableDebt: ethers.formatUnits(userData[1], 18),
        // currentVariableDebt: ethers.formatUnits(userData[2], 18),
        // principalStableDebt: ethers.formatUnits(userData[3], 18),
        // scaledVariableDebt: ethers.formatUnits(userData[4], 18),
        // // Rates are in ray units (27 decimals)
        // stableBorrowRate: ethers.formatUnits(userData[5], 27),
        // liquidityRate: ethers.formatUnits(userData[6], 27)
      }
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Error fetching user reserve data:', error);
    res.status(500).json({ 
      error: 'Error fetching user reserve data',
      details: error.message 
    });
  }
}