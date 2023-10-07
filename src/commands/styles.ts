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

const ticks = "```"
const lineBreak = "\n"
const idFieldLength = 6
const nameFieldLength = 20
const maxMessageLength = 4096

async function embeds(
  results: Array<Style>,
  locale: Locale
): Promise<Array<EmbedBuilder>> {
  const entries = results.filter(s => !s.isPremium).map((s, _) => {
    const name = s.name.slice(0, nameFieldLength)
    const idSpacing = ' '.repeat(idFieldLength - s.id.toString().length)
    const nameSpacing = ' '.repeat(nameFieldLength - name.length)

    return `${s.id}${idSpacing}${name}${nameSpacing}\n`
  })

  const header = `${ticks}${t('styles.header', locale)}${lineBreak}`

  const length = entries.length

  const splitted = entries.reduce((acc, line, i) => {
    const [processing, ...rest] = acc
    const tail = (i === length - 1) ? ticks : ''

    if ((`${processing}${line}${ticks}`).length < maxMessageLength) {
      return [`${processing}${line}${tail}`, ...rest]
    } else {
      return [`${header}${line}${tail}`, `${processing}${ticks}`, ...rest]
    }
  }, [header])

  return splitted.reverse().map(m => {
    const e = new EmbedBuilder().setTitle(t('styles.title', locale))
    return e.setDescription(m)
  })
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
      silent({ embeds: await embeds(result, interaction.locale) })
    )

    return
  }
}
