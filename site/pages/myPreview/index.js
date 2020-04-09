import Markdown from '../../../libs/markdown';


export default class MyPreview extends Markdown {
  document(locale) {
    return require(`../../docs/${locale}/myPreview.md`);
  }
}
