import Markdown from '../../../libs/markdown';

export default class MyPrint extends Markdown {
  document(locale) {
    return require(`../../docs/${locale}/print.md`);
  }
}
