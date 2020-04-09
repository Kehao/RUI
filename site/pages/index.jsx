export default {
  documents: {
    'quick-start': require('./quick-start'),
    develop: require('./develop')
  },
  components: {
    基础组件: {
      // button: require('./button'),
      // input: require('./input'),
      // checkbox: require('./checkbox'),
      myViewer: require('./myViewer'),
      myLoading: require('./myLoading')
    },
    业务组件: {
      ossUpload: require('./ossUpload'),
      mySelect: require('./mySelect'),
      myFamilyInput: require('./myFamilyInput'),
      myComPicture: require('./myComPicture'),
      myGeneInput: require('./myGeneInput'),
      myPreview: require('./myPreview'),
      myTime: require('./myTime'),
      myVirtualTable: require('./myVirtualTable')
    }
  },
  utils: {
    request: require('./request'),
    numberOperate: require('./numberOperate'),
    print: require('./print'),
    RSA: require('./rsa')
  }
};
