# Crib Bot

A feature-rich Discord bot built with **Discord.js** and **MongoDB**, designed to track and manage user donations (coins, items, daily, and weekly) in community servers—especially those integrated with **Dank Memer**. The bot supports dynamic prefixes, role assignments, and real-time donation updates, making it ideal for gaming or fundraising communities.

---

## 🚀 Features

- **Donation Tracking**: Monitors coin and item donations (e.g., Dank Memer items), with daily and weekly summaries stored in MongoDB.
- **Donation Command**: Moderators can use `!donations <user>` to view a user's total, daily, and category-specific donations in a clean embed.
- **Item Donation Processing**: Detects item donations from Dank Memer (`ID: 270904126974590976`) in designated channels, calculates their value, and updates user records.
- **Dynamic Prefixes**: Supports server-specific command prefixes for flexibility across multiple guilds.
- **Role Management**: Automatically assigns donation-based roles to users.
- **Welcome Messages**: Sends customizable welcome messages to new members.
- **Error Logging**: Logs unhandled rejections and errors to a specified channel for reliability.
- **Top.gg Integration**: Supports Top.gg webhooks for voting or analytics.
- **MongoDB Integration**: Persists donation data for robust storage and retrieval.

---

## 📦 Prerequisites

- **Node.js**: v16.6.0 or higher
- **MongoDB**: A running MongoDB instance (local or cloud, e.g., MongoDB Atlas)
- **Discord Bot Token**: Obtain from the [Discord Developer Portal](https://discord.com/developers/applications)
- **Dank Memer Bot**: Required for item donation tracking (optional for non-item features)

---

## ⚙️ Setup

### 1. Clone the Repository

```bash
git clone https://github.com/krisharekar/CribBot.git
cd CribBot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the root directory:

```env
TOKEN=your-discord-bot-token
MONGODB_URI=your-mongodb-connection-string
```

Update `config.json` with your bot’s settings (e.g., default prefix, channel IDs).

### 4. Set Up MongoDB

- Ensure your MongoDB instance is running.
- Create schemas for donations and categories (see `schemas/` directory).

### 5. Run the Bot

```bash
node index.js
```

---

## 📚 Usage

### Commands

- `!donations <user>`: Displays a user’s donation stats.  
  _(Requires `MANAGE_GUILD` permission)_

**Example:**
```bash
!donations @User#1234
```

### Donation Channels

- Configure donation channels in your server for item donation tracking.

### Custom Categories

- Define donation categories in `category-schema` for flexible tracking.

---

## 🗂️ File Structure

```
index.js                → Main bot file, initializes modules and event listeners  
donations.js            → Command to display user donation stats  
item-donations.js       → Handles item donation detection and processing  
schemas/                → MongoDB schemas for donations and categories  
assets/                 → Utility functions (e.g., prefix finder, role management)  
cache/                  → Caching for donation channels and item info  
donation-trackers/      → Modules for coin, item, daily, and weekly donation tracking  
```

---

## 📄 License

This project is licensed under the **MIT License**.
