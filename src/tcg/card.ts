import { MessageCache } from "../tcgChatInteractions/messageCache";
import { CardEmoji } from "./formatting/emojis";
import Game from "./game";

export interface CardCosmetic {
  cardImageUrl?: string;
  cardGif?: string;
}

export type CardProps = {
  title: string;
  description: (formattedEffects: string[]) => string;
  effects: number[];
  emoji?: CardEmoji;
  cosmetic?: CardCosmetic;
  cardAction: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache
  ) => void;
  conditionalTreatAsEffect?: (game: Game, characterIndex: number) => Card;
  empowerLevel?: number;
  priority?: number;
  imitated?: boolean;
  tags?: Record<string, number>;
  printEmpower?: boolean;
};

export default class Card implements CardProps {
  readonly EMPOWER_BOOST = 0.1;

  title: string;
  description: (formattedEffects: string[]) => string;
  effects: number[];
  emoji: CardEmoji;
  cosmetic?: CardCosmetic | undefined;
  cardAction: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache
  ) => void;
  conditionalTreatAsEffect?: (game: Game, characterIndex: number) => Card;
  empowerLevel: number;
  priority: number;
  imitated: boolean;
  tags: Record<string, number>;
  printEmpower: boolean;

  constructor(cardProps: CardProps) {
    this.title = cardProps.title;
    this.description = cardProps.description;
    this.effects = cardProps.effects;
    this.cardAction = cardProps.cardAction;
    this.conditionalTreatAsEffect = cardProps.conditionalTreatAsEffect;
    this.empowerLevel = cardProps.empowerLevel ?? 0;
    this.priority = cardProps.priority ?? 0;
    this.imitated = cardProps.imitated ?? false;
    this.tags = cardProps.tags ?? {};
    this.emoji = cardProps.emoji ?? CardEmoji.GENERIC;
    this.cosmetic = cardProps.cosmetic;
    this.printEmpower = cardProps.printEmpower ?? true;
  }

  getDescription(): string {
    const empoweredEffects: string[] = this.effects.map((effect) =>
      this.calculateEffectValue(effect).toFixed(2)
    );
    return this.description(empoweredEffects);
  }

  getTitle(): string {
    return (
      `${this.imitated ? "(Imitated) " : ""}` +
      `${this.title}` +
      `${this.printEmpower ? ` + ${this.empowerLevel}` : ""}`
    );
  }

  calculateEffectValue(effect: number) {
    return Number(
      (effect * (1 + this.empowerLevel * this.EMPOWER_BOOST)).toFixed(2)
    );
  }

  printCard(startingString: string = "") {
    return (
      `${startingString}${this.emoji} **${this.getTitle()}**\n` +
      `  - ${this.getDescription()}`
    );
  }

  clone(): Card {
    return new Card({ ...this });
  }
}
