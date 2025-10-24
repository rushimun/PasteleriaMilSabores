// jest.config.cjs
module.exports = {
  // 1. Entorno: Simula un navegador
  testEnvironment: 'jsdom',
  
  // 2. Setup: Importa los matchers extendidos de Jest DOM
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  
  // 3. Transformación: Usa babel-jest para manejar JSX y módulos modernos
  transform: {
    // Aplica babel-jest a archivos .js, .jsx, .mjs (módulos)
    '^.+\\.(js|jsx|mjs)$': 'babel-jest',
  },
  
  // 4. Mocks de Assets y Aliases
  moduleNameMapper: {

    '^src\\/(.*)$': '<rootDir>/src/$1', 
    
    // Mocks de Assets: Ignora importaciones de CSS/Assets
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  
  // 5. Patrones a Ignorar: Opcional, pero recomendado
  transformIgnorePatterns: [
    '/node_modules/',
    '\\.pnp\\.[^\\/]+$',
  ],
};