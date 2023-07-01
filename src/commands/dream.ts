import {
  ApplicationCommandOptionType,
  CommandInteraction,
  EmbedBuilder,
  InteractionReplyOptions,
  Locale,
} from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { Pulse } from '../types/pulse.js'
import Dreamer from '../dreamer.js'
import silent from '../utils/silent.js'
import t from '../utils/t.js'

async function embed(
  imageUrl: string,
  prompt: string,
  locale: Locale,
): Promise<EmbedBuilder> {
  return (
    new EmbedBuilder()
      .setTitle(t('dream.result', locale))
      .setDescription(`${prompt}\n[${t('dream.download', locale)}](${imageUrl})`)
      .setImage(imageUrl)
  )
}

const updateDisplayedImage = async (
  pulse: Pulse,
  paramsWrapper: InteractionReplyOptions,
  interaction: CommandInteraction,
) => {
  const mbResult = pulse.result?.final
  if (pulse.state === 'failed') {
    await interaction.editReply({
      ...paramsWrapper,
      embeds: [new EmbedBuilder().setTitle(t('dream.failed', interaction.locale))]
    })
  } else if (mbResult) {
    await interaction.editReply({
      ...paramsWrapper,
      embeds: [await embed(mbResult, pulse.inputSpec.prompt, interaction.locale)]
    })
  }
}

@Discord()
export class Dream {
  @Slash({
    description: t('dream.description', Locale.EnglishGB),
    name: 'dream',
    descriptionLocalizations: {
      'ru': t('dream.description', Locale.Russian)
    }
  })
  async handle(
    @SlashOption({
      description: 'Prompt',
      name: 'prompt',
      descriptionLocalizations: {
        'ru': t('dream.prompt', Locale.Russian)
      },
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    @SlashOption({
      description: 'Style ID',
      name: 'style',
      descriptionLocalizations: {
        'ru': t('dream.style', Locale.Russian)
      },
      required: false,
      type: ApplicationCommandOptionType.Integer,
    })
    @SlashOption({
      description: 'Display generation only to you',
      name: 'silent',
      descriptionLocalizations: {
        'ru': t('dream.silent', Locale.Russian)
      },
      required: false,
      type: ApplicationCommandOptionType.Boolean,
    })
    prompt: string,
    style: number | undefined,
    beSilent: boolean | undefined,
    interaction: CommandInteraction
  ): Promise<void> {
    const paramsWrapper =
      beSilent === true || beSilent === undefined ? silent({}) : {}

    await interaction.deferReply({ ...paramsWrapper })

    const finalPulse =
      await Dreamer.dream(
        style,
        prompt,
        undefined, //for now
        interimPulse => updateDisplayedImage(interimPulse, paramsWrapper, interaction)
      )

    updateDisplayedImage(finalPulse, paramsWrapper, interaction)

    return
  }
}
