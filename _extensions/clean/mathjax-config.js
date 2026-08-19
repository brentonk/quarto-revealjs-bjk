window.MathJax = {
  tex: {
    inlineMath: [['\\(', '\\)']],
    displayMath: [['\\[', '\\]']],
    processEscapes: true,
    processRefs: true,
    processEnvironments: true
  },
  chtml: {
    font: 'mathjax-stix2'
  },
  startup: {
    ready: () => {
      console.log('MathJax v4 ready with font: mathjax-stix2 (STIX Two)');
      MathJax.startup.defaultReady();
    }
  }
};
