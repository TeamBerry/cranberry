/* eslint-disable class-methods-use-this */
export default class EmojiClass {
  public static emojiToDisplay({ emoji }) {
    return String.fromCodePoint(...emoji.unified.split('-').map((u) => `0x${u}`));
  }
}
