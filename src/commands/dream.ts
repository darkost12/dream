import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  CommandInteraction,
  EmbedBuilder,
  ButtonBuilder,
  ButtonInteraction,
  MessageActionRowComponentBuilder,
  ButtonStyle,
  ComponentType,
  Locale,
} from 'discord.js'
import { Discord, Slash, SlashOption, ButtonComponent } from 'discordx'
import { Pulse } from '../types/pulse.js'
import Dreamer from '../dreamer.js'
import silent from '../utils/silent.js'
import t from '../utils/t.js'

const buttons = (
  imageUrl: string, showRedoButton: boolean, locale: Locale) => {
  const downloadButton = new ButtonBuilder()
    .setLabel(t('dream.download', locale))
    .setStyle(ButtonStyle.Link)
    .setURL(imageUrl)

  return (
    new ActionRowBuilder<MessageActionRowComponentBuilder>()
      .addComponents(
        showRedoButton ? [
          downloadButton,
          new ButtonBuilder()
            .setLabel(t('dream.redo', locale))
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('redo')
        ] : [
          downloadButton
        ]
      )
  )
}

async function imageEmbed(
  imageUrl: string,
  prompt: string,
  locale: Locale
): Promise<EmbedBuilder> {
  return new EmbedBuilder()
    .setTitle(t('dream.result', locale))
    .setDescription(prompt)
    .setImage(imageUrl)
}

const failEmbed = (locale: Locale): EmbedBuilder =>
  new EmbedBuilder().setTitle(t('dream.failed', locale))

const updateDisplayedMessage = async (
  pulse: Pulse,
  beSilent: boolean | undefined,
  interaction: CommandInteraction | ButtonInteraction,
) => {
  const mbResult = pulse.result?.final
  if (pulse.state === 'failed') {
    await interaction.editReply({
      embeds: [failEmbed(interaction.locale)],
      components: []
    })
  } else if (mbResult) {
    const message = await interaction.editReply({
      embeds: [await imageEmbed(mbResult, pulse.inputSpec.prompt, interaction.locale)],
      components: [buttons(mbResult, true, interaction.locale)]
    })

    try {
      const buttonInteraction = await message.awaitMessageComponent({
        componentType: ComponentType.Button, time: 30000
      })

      await interaction.editReply({
        embeds: [await imageEmbed(mbResult, pulse.inputSpec.prompt, interaction.locale)],
        components: [buttons(mbResult, false, interaction.locale)]
      })

      if (!buttonInteraction.deferred) {
        if (beSilent) {
          await buttonInteraction.deferReply(silent({}))
        } else {
          await buttonInteraction.deferReply()
        }
      }

      await buttonInteraction.editReply({
        embeds: [new EmbedBuilder().setTitle(t('dream.thinking', interaction.locale))],
        components: []
      })

      await processOne(
        pulse.inputSpec.prompt,
        pulse.inputSpec.style,
        beSilent,
        buttonInteraction
      )
    } catch (e: any) {
      if (e.toString().includes('Collector received no interactions before ending')) {
        await interaction.editReply({
          embeds: [await imageEmbed(mbResult, pulse.inputSpec.prompt, interaction.locale)],
          components: [buttons(mbResult, false, interaction.locale)]
        })
      } else {
        throw e
      }
    }
  } else {
    const lastPreview = pulse.photoUrlList.at(-1)

    if (lastPreview) {
      await interaction.editReply({
        embeds: [await imageEmbed(lastPreview, pulse.inputSpec.prompt, interaction.locale)]
      })
    }
  }
}

async function processOne(
  prompt: string,
  style: number | undefined,
  beSilent: boolean | undefined,
  interaction: CommandInteraction | ButtonInteraction
): Promise<any> {
  const finalPulse =
    await Dreamer.dream(
      style,
      prompt,
      undefined, //for now
      interimPulse => updateDisplayedMessage(interimPulse, beSilent, interaction)
    )

  updateDisplayedMessage(finalPulse, beSilent, interaction)
}

@Discord()
export class Dream {
  @ButtonComponent({ id: 'redo' })
  async buttonHandle(interaction: ButtonInteraction): Promise<void> {
    return
  }

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
    const paramsWrapper = beSilent === true ? silent({}) : {}

    await interaction.deferReply({ ...paramsWrapper })

    await processOne(prompt, style, beSilent, interaction)

    return
  }
}
