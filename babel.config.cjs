module.exports = {
  presets: [
    '@babel/preset-env',
    // Este preset es esencial para transformar JSX
    ['@babel/preset-react', { runtime: 'automatic' }] 
  ]
};