# Discord Generator Bot

A modular Discord.js v14 bot that manages "stock" of text-based items (redeem
codes, license keys, invite codes, or any other line-based data you provide)
and dispenses them to permitted users via DM. **No database is used** —
every piece of state lives in a plain `.txt` file.

## How storage works

| Folder        | Contents                                                              |
|----------------|------------------------------------------------------------------------|
| `/stocks`      | One `<service>.txt` file per service. Each line = one item in stock.   |
| `/cooldowns`   | One `<userId>.txt` file per user, holding their last-generation time.  |
| `/data`        | `genroles.txt` — extra role IDs granted access via `/addgenrole`.      |
| `/logs`        | `generations.txt` — a permanent audit trail of every generation.       |

Everything is read fresh from disk on every command, so there is no cache to
go stale and no database to install or maintain.

## Setup

1. **Install dependencies**
   ```
   npm install
   ```

2. **Create your bot application**
   - Go to the [Discord Developer Portal](https://discord.com/developers/applications), create an application + bot.
   - No privileged intents are required (the bot only uses default Guilds intent).
   - Invite the bot to your server with the `applications.commands` and `bot` scopes, and at minimum `Send Messages`, `View Channel`, and `Embed Links` permissions.

3. **Fill in `config.js`**
   ```js
   TOKEN: "...",          // Bot > Token
   CLIENT_ID: "...",      // General Information > Application ID
   GUILD_ID: "...",       // Your server ID (enable Developer Mode to copy it)
   OWNER_ID: "...",       // Your own Discord user ID
   GEN_ROLE_ID: "...",    // The role allowed to use /gen
   LOG_CHANNEL_ID: "...", // The channel generations get logged to
   COOLDOWN_TIME: 30,     // Minutes between generations, per user
   ```

4. **Deploy slash commands** (run again any time you edit a command's options)
   ```
   npm run deploy
   ```

5. **Start the bot**
   ```
   npm start
   ```

## Commands

**Owner only:** `/create-service`, `/delete-service`, `/restock`, `/clearstock`, `/addgenrole`, `/removegenrole`, `/reload`
**Everyone with the gen role (or the owner):** `/gen`
**Everyone:** `/services`, `/stock`, `/help`

### Restocking

`/restock` accepts either:
- The `lines` option — paste multiple lines directly (Discord preserves newlines in pasted text even though the box looks single-line).
- The `file` option — attach a `.txt` file with one item per line. Recommended for large restocks since Discord text options cap at 6000 characters.

## Extending the bot

- **Add a command:** drop a new file in `/commands` exporting `{ data, execute, ownerOnly?, autocomplete? }` — it's picked up automatically (or instantly via `/reload`, then `npm run deploy` if you changed its options/name).
- **Add an event:** drop a new file in `/events` exporting `{ name, execute, once? }`.
- **Change embed colors/branding:** edit the `COLORS`, `EMBED_FOOTER`, and `EMBED_AUTHOR` blocks in `config.js`.
- **Per-service cooldowns:** `utils/cooldownManager.js` currently tracks one global cooldown per user; you can key cooldown files by `${userId}-${service}` instead if you want independent cooldowns per service.

## Notes

- `popStock()` in `utils/stockManager.js` uses synchronous file I/O on purpose — Node never interleaves sync calls, which prevents two simultaneous `/gen` calls from grabbing the same line of stock.
- If a DM fails to send (closed DMs), the popped account is automatically returned to stock so nothing is lost.
- `config.js` is excluded via `.gitignore` since it contains your bot token — never commit it.
