# 🌈 Clarylisk Frontend

Welcome to the Clarylisk frontend repository! This guide will help you set up and run the Clarylisk application locally for development.

## ✨ Features

- 🛡️ AI-powered gambling content detection
- 💰 Secure Web3 donation processing
- 🔥 Approve/Burn system for donation management
- 📊 Transparent donation tracking and verification
- 🌐 Creator profiles and discovery

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [pnpm](https://pnpm.io/) (v7 or later)
- A code editor of your choice (we recommend [VSCode](https://code.visualstudio.com/))

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/clarylisk/frontend.git
cd frontend
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory and add the following environment variables:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_CREATOR_HUB_FACTORY=your_creator_hub_factory_address
NEXT_PUBLIC_IDRX_CONTRACT=your_idrx_contract_address
NEXT_PUBLIC_CLARYLISK_BACKEND=your_backend_url
NEXT_PUBLIC_CLARYLISK_CONTRACT=your_clarylisk_contract_address
NEXT_PUBLIC_XELLAR_APP_ID=your_xellar_app_id
NEXT_PUBLIC_CREATOR_LINK_GENERATOR=your_creator_link_generator_url
```

4. **Start the development server**

```bash
pnpm dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

## 🧩 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Your WalletConnect Project ID | `a1b2c3d4e5f6g7h8i9j0...` |
| `NEXT_PUBLIC_CREATOR_HUB_FACTORY` | Address of the Creator Hub Factory contract | `0x478AE04E752e47c5b1F597101CeF74f01F0386e6` |
| `NEXT_PUBLIC_IDRX_CONTRACT` | Address of the $IDRX token contract | `0x18Bc5bcC660cf2B9cE3cd51a404aFe1a0cBD3C22` |
| `NEXT_PUBLIC_CLARYLISK_BACKEND` | URL of the Clarylisk backend API | `https://api.clarylisk.com` |
| `NEXT_PUBLIC_CLARYLISK_CONTRACT` | Address of the main Clarylisk contract | `0x1234...` |
| `NEXT_PUBLIC_XELLAR_APP_ID` | Your Xellar application ID | `clarylisk_prod` |
| `NEXT_PUBLIC_CREATOR_LINK_GENERATOR` | URL for the creator link generator service | `https://links.clarylisk.com` |

## 🛠️ Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint to check code quality
- `pnpm test` - Run tests
- `pnpm clean` - Clean build artifacts

## 📱 Development Tips

### 🔄 Working with Web3

The application uses Wagmi and WalletConnect for Web3 integration. When testing locally, you can:

- Connect to the Lisk Mainnet
- Use a test wallet with some $IDRX tokens
- Check transaction status on Lisk Explorer

### 🧪 Testing the AI Detection

To test the gambling content detection:

1. Create a donation with innocent content to see it approved
2. Create a donation with gambling-related terms to see the AI flag it
3. Test the approve/burn functionality on detected content


## 🌍 Available Networks

- Lisk Mainnet (Default)

## 🤝 Contributing

We welcome contributions to Clarylisk! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚨 Support

If you encounter any issues or have questions, please file an issue on GitHub or contact our team at support@clarylisk.com.

---

<p align="center">Made with ❤️ by the Clarylisk Team</p>
