const cron = require('node-cron');
const noblox = require('noblox.js');
const { MessageEmbed, WebhookClient, Message } = require('discord.js');
require('dotenv').config();

const webhookClientHRE = new WebhookClient({ id: process.env.HRE_WEBHOOK_ID, token: process.env.HRE_WEBHOOK_TOKEN });
const webhookClientTSU = new WebhookClient({ id: process.env.TSU_WEBHOOK_ID, token: process.env.TSU_WEBHOOK_TOKEN });
const webhookClientGAR = new WebhookClient({ id: process.env.GAR_WEBHOOK_ID, token: process.env.GAR_WEBHOOK_TOKEN });

const HREGroupIds = [5908211, 7380854, 7617487, 5930749, 5930671, 5930772, 5930791];
const TSUGroupIds = [4802792, 4849580, 4901723, 4805062, 4805092, 4808054, 4948472, 5687123, 5737557, 5902649, 6018695, 11934361, 5117666, 4849688, 5855498]
const GARGroupIds = [5214183, 5352000, 5352039, 5352023, 5352093, 5369125, 5668908, 5674426, 5810035, 6018571, 6077194, 6286429, 6652666];

async function createOverviewEmbed(idArray, whClient) {
    const embed = new MessageEmbed()
        .setTitle('Overview')
        .setColor('#7EA16B')
        .setTimestamp()
    await idArray.forEach(id => {
        noblox.getGroup(id)
        .then((g) => {
            embed.addField(`${g.name}`, `${g.memberCount}`, true)
        })
    });

    setTimeout(() => {
        whClient.send({
            username: 'HRE Watcher',
            embeds: [embed]
        });
    }, 1500)
}

async function createInformationalEmbed(idArray, whClient) {
    await idArray.forEach(id => {
        const embed = new MessageEmbed()
            .setTimestamp()
            .setColor('#DBAD6A')
        noblox.getGroup(id)
        .then((g) => {
            embed.setTitle(`${g.name}`)
        });
        
        noblox.getRoles(id)
        .then(roles => {
            roles.forEach(role => {
                if (role.name === 'Guest') {
                    return
                }
                embed.addField(`${role.name}`, `${role.memberCount}`, true)
            })
        });
        setTimeout(() => {
            whClient.send({
                username: 'HRE Watcher',
                embeds: [embed]
            });
        }, 3000)
    })
}

cron.schedule('0 0 * * *', async () => {
    await createOverviewEmbed(TSUGroupIds, webhookClientTSU);
    await createOverviewEmbed(GARGroupIds, webhookClientGAR);
    await createOverviewEmbed(HREGroupIds, webhookClientHRE);

    await createInformationalEmbed(TSUGroupIds, webhookClientTSU)
    await createInformationalEmbed(GARGroupIds, webhookClientGAR)
    await createInformationalEmbed(HREGroupIds, webhookClientHRE);
    
    console.log('All jobs completed.')
});