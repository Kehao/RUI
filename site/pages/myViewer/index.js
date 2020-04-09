import Markdown from '../../../libs/markdown';
import './style.less';

export default class MyViewer extends Markdown {
  document(locale) {
    return require(`../../docs/${locale}/myViewer.md`);
  }
}
