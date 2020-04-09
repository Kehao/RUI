import Markdown from '../../../libs/markdown';

export default class MySelect extends Markdown {
  document(locale) {
    return require(`../../docs/${locale}/mySelect.md`);
  }
}
