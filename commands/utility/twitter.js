const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('twitter')
		.setDescription('Download video from twitter'),
	async execute(interaction) {
		await interaction.deferReply();
		await wait(4_000);
		await interaction.editReply('Pong!');
	},
};
