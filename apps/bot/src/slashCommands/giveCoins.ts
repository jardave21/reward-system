import { SlashCommandBuilder, type CacheType, type CommandInteraction, type User as UserDiscord } from 'discord.js';

import { api } from '../api';
import translate from '../i18n/en.json';
import { type SlashCommand } from '../types';

const showSentCoinsMsg = (interaction: CommandInteraction<CacheType>, coins: string) => {
  const receiver = interaction.options.getUser('user');
  void interaction.reply(`${interaction.user} has added ${coins} Indie Tokens to ${receiver}'s wallet.`);
};

/** Main command */
const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('give-coins')
    .setDescription(translate.commands.giveCoins.give)
    .addUserOption((option) =>
      option.setName('user').setDescription(translate.commands.giveCoins.receiver).setRequired(true),
    )
    .addStringOption((option) =>
      option.setName('coins').setDescription(translate.commands.giveCoins.amount).setRequired(true),
    ),
  execute: async (interaction) => {
    const user = interaction.options.getUser('user');
    // TODO: Fix an Type issue with .getString, it is not recognized as a function
    const coins: string = (interaction.options as any).getString('coins'); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
  
    
    
    // String to int
    const coins: number = parseInt(coinsString);
    if (coins > 0) {
      // Update or Create User
      const updatedUser = await api.user.sendCoinsByUserId.mutate({
        user: user as UserDiscord,
        coins: coins,
      });
      if (updatedUser.data) showSentCoinsMsg(interaction, coins);
    } else {
      // Send error messages 
      void interaction.reply('El valor de coins debe ser mayor que 0.');
    }
  },
  cooldown: 10,
};

export default command;
