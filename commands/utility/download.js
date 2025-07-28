const { SlashCommandBuilder } = require('discord.js');
const { spawn } = require('child_process');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('download')
		.setDescription('Download video from twitter/instagram/youtube/tiktok.')
		.addStringOption(option =>
			option.setName('url')
				.setDescription('Link to the video')
				.setRequired(true)
		)
		.addBooleanOption(option =>
			option.setName('private')
				.setDescription('Set to only visible to you')
				.setRequired(false)
		),
	async execute(interaction) {
		const isEphemeral = interaction.options.getBoolean('private') ?? false;

		const videoUrl = interaction.options.getString('url');
		
		// URL Validation
		const acceptedDomains = ["twitter.com", "x.com", "instagram.com", "youtube.com", "youtu.be", "tiktok.com"];
		if (!acceptedDomains.some(domain => videoUrl.includes(domain))) {
			await interaction.reply({
				content: '❌ Error: Please provide a valid link (accepted sites: twitter.com, instagram.com, youtube.com, tiktok.com).',
				ephemeral: true
			});
			return;
		}

		await interaction.deferReply({ ephemeral: isEphemeral });

		try {
			// Ścieżka do skryptu scraper.py
			const scraperPath = path.join(__dirname, '../../scraper.py');
			
			// Wywołaj skrypt Python
			const pythonProcess = spawn('python3', [scraperPath, videoUrl]);

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
			console.error('Błąd w komendzie download:', error);
			await interaction.editReply({
				content: '❌ Wystąpił nieoczekiwany błąd.'
			});
		}
	},
};
