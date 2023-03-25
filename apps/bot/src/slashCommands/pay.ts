import { SlashCommandBuilder, type CacheType, type CommandInteraction, type User as UserDiscord } from 'discord.js';

import { api } from '../api';
import translate from '../i18n/en.json';
import { type SlashCommand } from '../types';

const showSentCoinsMsg = (interaction: CommandInteraction<CacheType>, coins: string) => {
  const receiver = interaction.options.getUser('user');
  void interaction.reply(`${interaction.user} has paid ${coins} Indie Tokens to ${receiver}.`);
};

const showNoCoinsMsg = (interaction: CommandInteraction<CacheType>) => {
  const receiver = interaction.options.getUser('user');
  void interaction.reply(`${interaction.user} doesn't have enough Indie Tokens to pay ${receiver}.`);
};

/** Main command */
const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('pay')
    .setDescription(translate.commands.pay.description)
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

    // Subtract coins from the recipient
    const recipientUser = await api.user.substractCoinsByUserId.mutate({
      user: interaction.user as UserDiscord,
      coins: parseInt(coins),
    });

    if (recipientUser.status !== 'success') showNoCoinsMsg(interaction);

    // Update or Create User
    const updatedUser = await api.user.sendCoinsByUserId.mutate({
      user: user as UserDiscord,
      coins: parseInt(coins),
    });

    if (updatedUser.data) showSentCoinsMsg(interaction, coins);
  },
  cooldown: 10,
};

export default command;
