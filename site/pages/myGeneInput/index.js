import Markdown from '../../../libs/markdown';

export default class MyGeneInput extends Markdown {
  document(locale) {
    return require(`../../docs/${locale}/myGeneInput.md`);
  }
}
