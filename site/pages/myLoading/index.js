import Markdown from '../../../libs/markdown';

export default class MyLoading extends Markdown {
  document(locale) {
    return require(`../../docs/${locale}/myLoading.md`);
  }
}
