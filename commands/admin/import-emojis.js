const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const { Permissions } = Discord;
const path = require('path');
const fs = require('fs');


// /!\ Actuellement n'importe qui peut utiliser via slash
module.exports = {
	name: 'import-emojis',
	aliases: ['add-role', 'ajouter-jeu'],
	category: 'Admin',
	description: 'Importe et synchronise les emojis du serveur discord où est executé la commande.',
	ownerOnly: true,
	guildOnly: true,
	permissions: ['SEND_MESSAGES', 'MANAGE_EMOJIS', 'USE_EXTERNAL_EMOJIS'],
	hidden: true,
	slash: false,

	callback: async ({ client, message, interaction, args }) => {
		const msg = message ||interaction
		const emojiDirectory = path.join(__dirname, '../../emojis')
        console.log(`List emojis in directory '${emojiDirectory}'`)

        fs.readdir(emojiDirectory, (err, files) => {
            if (err) return console.error(err);

            files.forEach((file) => {
                if (file.indexOf('.png') === -1) return

                const filePath = `${emojiDirectory}/${file}`
                const emojiName = file.replace('.png', '')
                const isAlreadyAdded = msg.guild.emojis.cache.some(emoji => emoji.name === emojiName)

                if (!isAlreadyAdded) {
                    console.log(`add emoji ${filePath}`)
                    msg.guild.emojis.create(filePath, emojiName)
                }
            });
        });

        return mTxServUtil.saySuccess(msg, `Les emojis ont été importés et synchronisés.`)
	}
};