import Markdown from '../../../libs/markdown';

export default class MyFamilyInput extends Markdown {
  document(locale) {
    return require(`../../docs/${locale}/myFamilyInput.md`);
  }
}
