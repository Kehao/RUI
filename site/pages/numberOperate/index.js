import Markdown from '../../../libs/markdown';

export default class NumberOperate extends Markdown {
  document(locale) {
    return require(`../../docs/${locale}/numberOperate.md`);
  }
}
