module.exports = {
  presets: [
    [
      'babel-preset-kyt-react',
      {
        envOptions: {
          client: {
            targets: {
              node: 'current',
            },
          },
          server: {
            targets: {
              node: 'current',
            },
          },
        },
      },
    ],
  ],
};
