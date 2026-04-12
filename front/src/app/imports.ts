import('@emoji-mart/data').then(({ default: data }) => {
  import('emoji-mart').then(({ init }) => {
    init({ data });
  });
});
