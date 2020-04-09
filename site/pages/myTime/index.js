import Markdown from '../../../libs/markdown';

export default class MyTime extends Markdown {
  document(locale) {
    return require(`../../docs/${locale}/myTime.md`);
  }
}
