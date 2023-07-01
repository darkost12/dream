import {
  CommandInteraction,
  EmbedBuilder,
  Locale,
} from 'discord.js'
import { Discord, Slash } from 'discordx'
import { Style } from '../types/style.js'
import Dreamer from '../dreamer.js'
import silent from '../utils/silent.js'
import t from '../utils/t.js'

async function embed(
  results: Array<Style>,
  locale: Locale
): Promise<EmbedBuilder> {
  const embed = new EmbedBuilder().setTitle(t('styles.title', locale))

  const entries = results.map((s, _) => {
    const idSpacing = ' '.repeat(5 - s.id.toString().length)
    const nameSpacing = ' '.repeat(24 - s.name.length)

    return `${s.id}${idSpacing}${s.name}${nameSpacing}${s.isPremium ? t('styles.premium', locale) : t('styles.free', locale)}`
  })

  return embed.setDescription("```" + t('styles.header', locale) + "\n" + entries.join('\n') + "```")
}

@Discord()
export class Styles {
  @Slash({
    description: t('styles.description', Locale.EnglishGB),
    name: 'styles',
    descriptionLocalizations: {
      'ru': t('styles.description', Locale.Russian)
    }
  })
  async handle(
    interaction: CommandInteraction
  ): Promise<void> {
    await interaction.deferReply(silent({}));

    const result = await Dreamer.listStyles()

    await interaction.editReply(
      silent({ embeds: [await embed(result, interaction.locale)] })
    )

    return
  }
}
