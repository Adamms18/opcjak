const { SlashCommandBuilder } = require('discord.js');
const { spawn } = require('child_process');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('twitter')
		.setDescription('Download video from twitter')
		.addStringOption(option =>
			option.setName('url')
				.setDescription('Link do tweeta z video')
				.setRequired(true)
		),
	async execute(interaction) {
		const tweetUrl = interaction.options.getString('url');
		
		// Walidacja URL
		if (!tweetUrl.includes('twitter.com') && !tweetUrl.includes('x.com')) {
			await interaction.reply({
				content: '❌ Błąd: Proszę podać poprawny link do tweeta.',
				ephemeral: true
			});
			return;
		}

		await interaction.deferReply();

		try {
			// Ścieżka do skryptu scraper.py
			const scraperPath = path.join(__dirname, '../../scraper.py');
			
			// Wywołaj skrypt Python
			const pythonProcess = spawn('python3', [scraperPath, tweetUrl]);
			
			let output = '';
			let errorOutput = '';
			
			pythonProcess.stdout.on('data', (data) => {
				output += data.toString();
			});
			
			pythonProcess.stderr.on('data', (data) => {
				errorOutput += data.toString();
			});
			
			pythonProcess.on('close', async (code) => {
				if (code === 0) {
					const videoUrl = output.trim();
					if (videoUrl) {
						await interaction.editReply({
							content: `${videoUrl}`
						});
					} else {
						await interaction.editReply({
							content: '❌ Nie udało się pobrać video z tego tweeta.'
						});
					}
				} else {
					// Błąd w skrypcie Python
					const errorMessage = errorOutput.trim() || 'Wystąpił nieoczekiwany błąd podczas przetwarzania tweeta.';
					await interaction.editReply({
						content: `❌ ${errorMessage}`
					});
				}
			});
			
			pythonProcess.on('error', async (error) => {
				console.error('Błąd podczas uruchamiania skryptu Python:', error);
				await interaction.editReply({
					content: '❌ Błąd: Nie udało się uruchomić skryptu. Sprawdź czy Python jest zainstalowany.'
				});
			});
			
		} catch (error) {
			console.error('Błąd w komendzie twitter:', error);
			await interaction.editReply({
				content: '❌ Wystąpił nieoczekiwany błąd.'
			});
		}
	},
};
