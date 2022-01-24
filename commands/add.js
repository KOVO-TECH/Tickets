const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Přidat někoho do tohoto ticketu')
    .addUserOption(option =>
      option.setName('člen')
        .setDescription('Člen kterého chcete přidat')
        .setRequired(true)),
  async execute(interaction, client) {
    const chan = client.channels.cache.get(interaction.channelId);
    const user = interaction.options.getUser('target');
    if (!interaction.member.roles.cache.find(r => r.id === client.config.roleSupport)) return interaction.reply({ content: "Musíš mít roli <@&" + client.config.roleSupport + ">.", ephemeral: true })
    if (chan.name.includes('ticket')) {
      chan.edit({
        permissionOverwrites: [{
          id: user,
          allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
        },
        {
          id: interaction.guild.roles.everyone,
          deny: ['VIEW_CHANNEL'],
        },
        {
          id: client.config.roleSupport,
          allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
        },
        ],
      }).then(async () => {
        interaction.reply({
          content: `<@${user.id}> je přidán do ticketu!`
        });
      });
    } else {
      interaction.reply({
        content: 'Nejseš v ticketu!',
        ephemeral: true
      });
    };
  },
};
