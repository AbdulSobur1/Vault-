import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.WALLET_ENCRYPTION_KEY!;

if (!ENCRYPTION_KEY) throw new Error('WALLET_ENCRYPTION_KEY not set');

const VALID_NETWORKS = ['mainnet', 'sepolia'] as const;
export type CryptoNetwork = (typeof VALID_NETWORKS)[number];

export function parseNetwork(network?: string): CryptoNetwork {
  const n = network ?? process.env.NEXT_PUBLIC_CRYPTO_NETWORK ?? 'sepolia';
  if (!VALID_NETWORKS.includes(n as CryptoNetwork)) {
    return 'sepolia';
  }
  return n as CryptoNetwork;
}

export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

export function decrypt(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function generateWallet(): {
  address: string;
  privateKey: string;
  mnemonic: string;
  encryptedPrivateKey: string;
  encryptedMnemonic: string;
} {
  const wallet = ethers.Wallet.createRandom();
  const mnemonic = wallet.mnemonic?.phrase ?? '';

  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic,
    encryptedPrivateKey: encrypt(wallet.privateKey),
    encryptedMnemonic: encrypt(mnemonic),
  };
}

export function getProvider(network: CryptoNetwork = 'sepolia') {
  const apiKey = process.env.ALCHEMY_API_KEY!;
  const baseUrl = network === 'mainnet'
    ? process.env.ALCHEMY_ETH_MAINNET!
    : process.env.ALCHEMY_ETH_SEPOLIA!;

  return new ethers.JsonRpcProvider(`${baseUrl}${apiKey}`);
}

export function getWalletInstance(encryptedPrivateKey: string, network: CryptoNetwork = 'sepolia') {
  const privateKey = decrypt(encryptedPrivateKey);
  const provider = getProvider(network);
  return new ethers.Wallet(privateKey, provider);
}

export async function getETHBalance(address: string, network: CryptoNetwork = 'sepolia'): Promise<string> {
  const provider = getProvider(network);
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

export const TOKEN_CONTRACTS: Record<string, Record<string, string>> = {
  mainnet: {
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  },
  sepolia: {
    USDT: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06',
    USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
  },
};

export async function getTokenBalance(
  address: string,
  tokenSymbol: 'USDT' | 'USDC',
  network: CryptoNetwork = 'sepolia'
): Promise<string> {
  const provider = getProvider(network);
  const contractAddress = TOKEN_CONTRACTS[network][tokenSymbol];
  if (!contractAddress) return '0';

  const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
  const [balance, decimals] = await Promise.all([
    contract.balanceOf(address),
    contract.decimals(),
  ]);

  return ethers.formatUnits(balance, decimals);
}

export async function sendETH(
  encryptedPrivateKey: string,
  toAddress: string,
  amountETH: string,
  network: CryptoNetwork = 'sepolia'
): Promise<{ txHash: string; blockExplorerUrl: string }> {
  const wallet = getWalletInstance(encryptedPrivateKey, network);

  const tx = await wallet.sendTransaction({
    to: toAddress,
    value: ethers.parseEther(amountETH),
  });

  await tx.wait();
  const explorerBase = network === 'mainnet'
    ? 'https://etherscan.io/tx'
    : 'https://sepolia.etherscan.io/tx';

  return {
    txHash: tx.hash,
    blockExplorerUrl: `${explorerBase}/${tx.hash}`,
  };
}

export async function sendToken(
  encryptedPrivateKey: string,
  tokenSymbol: 'USDT' | 'USDC',
  toAddress: string,
  amount: string,
  network: CryptoNetwork = 'sepolia'
): Promise<{ txHash: string; blockExplorerUrl: string }> {
  const wallet = getWalletInstance(encryptedPrivateKey, network);
  const contractAddress = TOKEN_CONTRACTS[network][tokenSymbol];
  const contract = new ethers.Contract(contractAddress, ERC20_ABI, wallet);

  const decimals = await contract.decimals();
  const parsedAmount = ethers.parseUnits(amount, decimals);

  const tx = await contract.transfer(toAddress, parsedAmount);
  await tx.wait();

  const explorerBase = network === 'mainnet'
    ? 'https://etherscan.io/tx'
    : 'https://sepolia.etherscan.io/tx';

  return {
    txHash: tx.hash,
    blockExplorerUrl: `${explorerBase}/${tx.hash}`,
  };
}
